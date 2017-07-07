#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json
import pandas as pd

# re for json files
FNRE = re.compile("\S+\.json$")

form = cgi.FieldStorage()
#json_files = []
#for nfile in form.keys():
#   json_files.append(form.getvalue(nfile))
json_files = form.getlist('file_list')
filetype = form.getlist('filetype')
sessionid = form.getlist('sessionid')

# fname safety check

for index, fn in enumerate(json_files):
    if not re.match(FNRE, fn):
        sys.exit(-1)
    json_files[index] = "."+fn
    
#json_files = ["test/HCT116-5-4-p.json","test/HCT116-5-4.json","test/HCT116-8-3-c3.json","test/HCT116-8-3-c4.json"]
#filetype = "aneuploidy"
#sessionid= "eb48b23fd6473489433af976c9c11c9c"

main = pd.read_csv("../main_files/human/gene_function.txt",sep="\t")
main = main[['gene','process']]

main.set_index(['gene'], inplace=True)

for file in json_files:
    
    df = pd.read_json(file)    
    ID = df['sampleID'][1]
    df = df[['gene','log2']]
    df.drop_duplicates(["gene"],inplace=True)
    df.set_index(['gene'], inplace=True)
    df.rename(columns={'log2':ID}, inplace=True)

    if main.empty:
        main = df
    else:
        main = main.join(df)
    
cmd = "rm -R ../data/PCA/" + ''.join(sessionid) + "/*"
os.system(cmd)

targetpath= "../data/user_uploads/" + ''.join(sessionid) + "/combined-PCA.csv"
main.to_csv(targetpath)

    
cmd = "/usr/local/bin/Rscript PCA.R "  + ''.join(sessionid) + ' ' + ' '.join(filetype) + ' ' + ' '.join(json_files)
os.system(cmd)

with open("../data/user_uploads/"+''.join(sessionid)+"/PCA/All Processes-pca.json") as result:
    #result = {'success':'true','message':'The Command Completed Successfully'};
    print 'Content-Type: application/json\n\n'
    #print(json.load(result))
    print json.dumps(json.load(result))


#print "Content-type: text/html\n"
#print "<html>"
#print cmd
#print "</html>"
