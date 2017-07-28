#!/usr/bin/python

import cgi, os, re, sys
#import cgitb;cgitb.enable()
import json
import pandas as pd

import collections
import pandas as pd

import matplotlib
matplotlib.use('Agg')

import mpld3
from mpld3 import utils
from mpld3 import plugins
import seaborn_hm
#import seaborn as sns

## re for json files
FNRE = re.compile("\S+\.json$")

form = cgi.FieldStorage()
#json_files = []
#for nfile in form.keys():
#   json_files.append(form.getvalue(nfile))
json_files = form.getlist('file_list')
sessionid = form.getlist('sessionid')

for index, fn in enumerate(json_files):
    if not re.match(FNRE, fn):
      sys.exit(-1)
    json_files[index] = "."+fn

#json_files = ["test/HCT116-5-4-p.json","test/HCT116-5-4.json","test/HCT116-8-3-c3.json","test/HCT116-8-3-c4.json"]
#sessionid= "eb48b23fd6473489433af976c9c11c9c"


class PluginBase(object):
    def get_dict(self):
        return self.dict_

    def javascript(self):
        if hasattr(self, "JAVASCRIPT"):
            if hasattr(self, "js_args_"):
                return self.JAVASCRIPT.render(self.js_args_)
            else:
                return self.JAVASCRIPT
        else:
            return ""

    def css(self):
        if hasattr(self, "css_"):
            return self.css_
        else:
            return ""
        
class PointHTMLTooltip2(PluginBase):

    def __init__(self, points, labels=None,
                 hoffset=0, voffset=10, css=None):
        self.points = points
        self.labels = labels
        self.voffset = voffset
        self.hoffset = hoffset
        self.css_ = css or ""
        if isinstance(points, matplotlib.lines.Line2D):
            suffix = "pts"
        else:
            suffix = None
        self.dict_ = {"type": "htmltooltip",
                      "id": utils.get_id(points, suffix),
                      "labels": labels,
                      "hoffset": hoffset,
                      "voffset": voffset}

outputpath= "../data/user_uploads/" + ''.join(sessionid) + "/heatmap/"
main = pd.read_csv("../data/user_uploads/" + ''.join(sessionid) + "/combined-heatmap.csv")
urls = pd.read_csv("../data/user_uploads/" + ''.join(sessionid) + "/combined-url.csv")
main.set_index(['gene'],inplace=True)


processes = sorted(main.process.unique())
processes = processes[5:]
for process in processes:
    
    df = main[main['process'] == process]   
    df.drop(['process'],1,inplace=True)
    df.dropna(thresh=len(df.columns)*0.7,inplace=True)
    mask = df.isnull()
    df.fillna(0,inplace=True)
    
    if (df.shape[0] >= 3):
    
        cbar_kws = { 'vmin' : -2, 'vmax':2 }
        cm= seaborn_hm.clustermap(df,mask=mask,**cbar_kws)
        
        p = cm.heatmap.mesh
        df2 = cm.data2d
        dcol = cm.ax_col_dendrogram.get_position()
        drow = cm.ax_row_dendrogram.get_position()
        cax = cm.cax.get_position()
        hm = cm.ax_heatmap.get_position()
        cm.ax_col_dendrogram.set_position([dcol.x0-drow.width*0.75, dcol.y0, dcol.width, dcol.height*0.75])
        cm.ax_row_dendrogram.set_position([drow.x0, drow.y0, drow.width*0.25, drow.height])
        cm.ax_heatmap.set_position([hm.x0-drow.width*0.75, hm.y0, hm.width, hm.height])
        cm.cax.set_position([cax.x0,cax.y0,cax.width,cax.height*0.75])
        
        
        df2 = df2.T
        df2= df2[df2.columns[::-1]]
        
        df3 = pd.DataFrame()
        index=0
        rowc=0
        for row in df2:
            colc=0
            for col in df2[row]:
                thing = {'gene': [row], 'sample': [df2.index[colc]], 'value': col}
                things = pd.DataFrame(thing, index=[index])
                if df3.empty:
                    df3 = things
                else:
                    df3 = pd.concat([df3,things])
                colc += 1
                index += 1
            rowc+=1
        
        df3 = df3.merge(urls,how="left",on="sample")
        
        labels = df3.to_json(orient='records')
        
        tooltip = PointHTMLTooltip2(p, labels,voffset=10, hoffset=10)
        plugins.connect(cm.fig, tooltip)
        
        html = mpld3.fig_to_dict(cm.fig)
        outputname = outputpath + process+ '.json'
        with open(outputname, 'w') as fp:
            json.dump(html, fp)

print "Content-type: text/html\n"
print "<html>"
print sessionid
print "</html>"