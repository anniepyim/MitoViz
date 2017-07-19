#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json
import pandas as pd
import numpy as np
import sys
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale

form = cgi.FieldStorage()
jsons = form.getvalue('jsons')
filetype = form.getvalue('filetype')
sessionid = form.getvalue('sessionid')

#data = ["test/HCT116-5-4-p.json","test/HCT116-5-4.json","test/HCT116-8-3-c3.json","test/HCT116-8-3-c4.json"]
#filetype = "aneuploidy"
#sessionid= "1fc40dfda008941e57491cf5f8d4f8ba"

data = json.loads(jsons)
isGroup = isinstance(data, dict)

with open('test.json', 'w') as fp:
    fp.write(jsons)

genefunc = pd.read_csv("../main_files/human/gene_function.txt",sep="\t")
genefunc = genefunc[['gene','process']]

if filetype == "aneuploidy":
    info = pd.read_csv("aneuploidy-data.txt",sep="\t")
elif filetype == "TCGA":
    info = pd.read_csv("tcga-data.txt",sep="\t")

main = pd.DataFrame()
grouping = pd.DataFrame()
index=0

if (not isGroup):
    for jsonfile in data:
        thefile = "../"+jsonfile
        df = pd.read_json("../"+jsonfile)
        samplename = df['sampleID'][0]
        df = df[['gene','log2']]
        df.drop_duplicates(["gene"],inplace=True)
        df.rename(columns={'log2': samplename}, inplace=True)
        
        if main.empty:
            main = pd.merge(genefunc,df,on="gene",how='inner')
        else:
            main = pd.merge(main,df,on="gene",how='inner')
            
        row = {'sampleID': samplename, 'url':jsonfile}
        rowpd = pd.DataFrame(row, index=[index])

        if grouping.empty:
            grouping = rowpd
        else:
            grouping = pd.concat([grouping,rowpd])
        index += 1
        
else:
    for group in data:        
        for jsonfile in data[group]:
            thefile = "../"+jsonfile
            df = pd.read_json("../"+jsonfile)
            samplename = df['sampleID'][0]
            df = df[['gene','log2']]
            df.drop_duplicates(["gene"],inplace=True)
            df.rename(columns={'log2': samplename}, inplace=True)

            if main.empty:
                main = pd.merge(genefunc,df,on="gene",how='inner')
            else:
                main = pd.merge(main,df,on="gene",how='inner')
            
            row = {'sampleID': samplename, 'group': group, 'url':jsonfile}
            rowpd = pd.DataFrame(row, index=[index])
        
            if grouping.empty:
                grouping = rowpd
            else:
                grouping = pd.concat([grouping,rowpd])
            index += 1

            
cmd = "rm -R ../data/user_uploads/" + ''.join(sessionid) + "/PCA/*"
os.system(cmd)

#Perform PCA for all genes
allmito = main[main.columns[2:]].transpose().reset_index()
X = np.array(allmito.drop(['index'],1))
y = np.array(allmito['index'])

#Scaling the values
#X = scale(X)

pca = PCA(n_components=3)
pca.fit(X)
X = pca.transform(X)
            
pcadf = pd.DataFrame(X,columns=['PC1','PC2','PC3'],index=y).reset_index()
pcadf.rename(columns={'index': "sampleID"}, inplace=True)

pcadf = pd.merge(pcadf,grouping,on='sampleID',how='inner')
pcadf = pd.merge(pcadf,info,on='sampleID',how='inner')

pcadict = pcadf.to_dict(orient='records')
pcadf = pcadf.to_json(orient='records')
with open('../data/user_uploads/'+''.join(sessionid)+'/PCA/All Processes-pca.json', 'w') as fp:
    json.dump(pcadict,fp)
    

#Perform PCA for each process
mitoproc = main['process'].unique()

for proc in mitoproc:
    subset = main[main['process']==proc]
    if (subset.shape[0] > 3):
        subset = subset[subset.columns[2:]].transpose().reset_index()
        X = np.array(subset.drop(['index'],1))
        y = np.array(subset['index'])

        #Scaling the values
        X = scale(X)

        pca = PCA(n_components=3)
        pca.fit(X)
        X = pca.transform(X)

        pcadf2 = pd.DataFrame(X,columns=['PC1','PC2','PC3'],index=y).reset_index()
        pcadf2.rename(columns={'index': "sampleID"}, inplace=True)

        pcadf2 = pd.merge(pcadf2,info,on='sampleID',how='inner')
        pcadf2 = pd.merge(pcadf2,grouping,on='sampleID',how='inner')

        pcadict2 = pcadf2.to_dict(orient='records')
        with open('../data/user_uploads/'+''.join(sessionid)+'/PCA/'+''.join(proc)+'-pca.json', 'w') as fp:
            json.dump(pcadict2,fp)


print 'Content-Type: application/json\n\n'
print pcadf
