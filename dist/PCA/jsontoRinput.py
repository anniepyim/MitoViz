import json
import sys

log2dict = {}
genelist = []
samplelist = []
output = open('R-input.txt', 'w')  
count = 0

for argv in sys.argv:
    
    if (count > 0):
        sample = argv.split('.')[0]
        samplelist.append(sample)
        
        with open(argv) as data_file:    
            data = json.load(data_file)

        for entry in data:
            geneprocess = entry['gene']+'\t'+entry['process']
            if geneprocess not in log2dict:
                log2dict[geneprocess] = {}
            log2dict[geneprocess][sample] = str(format(entry['log2'],'.4f'))
                       
    count += 1
    
for gene in sorted(log2dict.keys()):
    for sample in samplelist:
        if sample not in log2dict[gene]:
            log2dict[gene][sample] = '0'

output.write('gene'+'\t'+'process'+'\t'+'\t'.join(samplelist)+'\n')

for gene in sorted(log2dict.keys()):
    mm = ''
    for sample in samplelist:
        mm = mm + '\t' + log2dict[gene][sample]
    output.write(gene + mm + '\n')

output.close()