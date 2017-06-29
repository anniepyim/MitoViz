#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json
import pandas as pd


data = json.load(sys.stdin)
isGroup = isinstance(data, dict)

genefunc = pd.read_csv("../main_files/human/gene_function.txt",sep="\t")
genefunc = genefunc[['gene','process','function']]


main = pd.DataFrame()

if (not isGroup):
    for jsonfile in data:
        thefile = "../"+jsonfile
        df = pd.read_json("../"+jsonfile)
        df = df[['gene','log2','sampleID','mutation','pvalue']]
        df.drop_duplicates(["gene"],inplace=True)
        df = pd.merge(df,genefunc,on="gene",how='inner')
        
        if main.empty:
            main = df
        else:
            main = main.append(df)

else:
    genefunc.set_index(['gene'], inplace=True)
    for group in data:

        log2all = pd.DataFrame()
        log2 = pd.DataFrame()

        for jsonfile in data[group]:
            thefile = "../"+jsonfile
            df = pd.read_json("../"+jsonfile)
            ID = df['sampleID'][1]
            df = df[['gene','log2']]
            df.drop_duplicates(["gene"],inplace=True)
            df.set_index(['gene'], inplace=True)
            df.rename(columns={'log2':ID}, inplace=True)

            if log2all.empty:
                log2all = df
            else:
                log2all = log2all.join(df,how="outer")

        log2['log2'] = log2all.mean(axis=1)
        log2['pvalue'] = 1
        log2['mutation'] = ""
        log2['sampleID'] = group
        log2 = log2.join(genefunc,how='inner')
        log2['gene'] = log2.index

        if main.empty:
            main = log2
        else:
            main = main.append(log2)
    
main.sort_values(["gene","sampleID"], inplace=True)
main = main.to_json(orient='records')

print 'Content-Type: application/json\n\n'
print (main)
