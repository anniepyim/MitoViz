#!/usr/bin/python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json
import pandas as pd

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

json_files = ["test/HCT116-5-4-p.json","test/HCT116-5-4.json","test/HCT116-8-3-c3.json","test/HCT116-8-3-c4.json"]
sessionid= "eb48b23fd6473489433af976c9c11c9c"
    
main = pd.read_csv("../main_files/human/gene_function.txt",sep="\t")
main = main[['gene','process']]

main.set_index(['gene'], inplace=True)

urls = pd.DataFrame()

for file in json_files:
    
    df = pd.read_json(file)
    
    url = {'sample': df['sampleID'][1], 'url': file}
    url = pd.DataFrame(url, index=[0])
    url.set_index(['sample'], inplace=True)
    
    ID = df['sampleID'][1]
    df = df[['gene','log2']]
    df.drop_duplicates(["gene"],inplace=True)
    df.set_index(['gene'], inplace=True)
    df.rename(columns={'log2':ID}, inplace=True)

    if main.empty:
        main = df
    else:
        main = main.join(df)
        
    if urls.empty:
        urls = url
    else:
        urls = pd.concat([urls,url])


cmd = "rm -R ../data/user_uploads/" + ''.join(sessionid) + "/heatmap/*"
os.system(cmd)

targetpath= "../data/user_uploads/" + ''.join(sessionid) + "/combined-heatmap.csv"
main.to_csv(targetpath)

targeturlpath= "../data/user_uploads/" + ''.join(sessionid) + "/combined-url.csv"
urls.to_csv(targeturlpath)

cmd = "/usr/local/bin/Rscript heatmap.R " + ''.join(sessionid)
os.system(cmd)

print "Content-type: text/html\n"
print "<html>"
print sessionid
print "</html>"