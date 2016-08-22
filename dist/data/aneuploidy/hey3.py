#!/usr/bin/env python

import sys
import re

inputfilepath = str(sys.argv[1])
outputfilepath1 = str(sys.argv[2])

        
with open(inputfilepath) as file:
    outputfile1 = open(outputfilepath1,'a')
    for line in file:
        lining = line.rstrip('\n')
        trans = lining.split('\t')[8].split('"')[1]
        outputfile1.write (lining+"gene_name \""+trans+"\"; \n")
outputfile1.close()