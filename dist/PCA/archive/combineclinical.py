import os
from os import listdir
from os.path import isfile, join


mypath = "pcas"
for f in listdir(mypath):
    if isfile(join(mypath, f)):
        filename = 'output/'+f.split('-pca')[0]+'.txt'
        #filename = 'hello.tsv'
        output = open(filename, 'w')  
        sampleinfo = {}
        
        with open("clinical-modified.txt") as clinical:
            next(clinical)
            for line in clinical:
                sampleID = line.rstrip('\n').split('\t')[0]
                cancer = line.rstrip('\n').split('\t')[1]
                gender = line.rstrip('\n').split('\t')[2]
                stage = line.rstrip('\n').split('\t')[4]
                brca = line.rstrip('\n').split('\t')[11]
                sampleinfo[sampleID] = cancer+'\t'+gender+'\t'+stage+'\t'+brca

        output.write('sampleID\tgroup\tgender\tstage\tbrca\tPC1\tPC2\tPC3\n')
        with open("pcas/"+f) as pc:
        #with open("yes.txt") as pc:
            next(pc)
            for line in pc:
                sampleID = line.rstrip('\n').split('\t')[0]
                PC1 = str(format(float(line.rstrip('\n').split('\t')[1]),'.4f'))
                PC2 = str(format(float(line.rstrip('\n').split('\t')[2]),'.4f'))
                PC3 = str(format(float(line.rstrip('\n').split('\t')[3]),'.4f'))
                output.write(sampleID+'\t'+sampleinfo[sampleID]+'\t'+PC1+'\t'+PC2+'\t'+PC3+'\n')

        output.close()
