#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json

# re for json files
FNRE = re.compile("\S+\.json$")

form = cgi.FieldStorage()
#json_files = []
#for nfile in form.keys():
#   json_files.append(form.getvalue(nfile))
json_files = form.getlist('file_list')
filetype = form.getlist('filetype')

# fname safety check

for index, fn in enumerate(json_files):
    if not re.match(FNRE, fn):
        sys.exit(-1)
    json_files[index] = "."+fn


os.system("rm ../data/PCA/*")
    
cmd = "/usr/local/bin/Rscript other.R "  + ' '.join(json_files)
os.system(cmd)



#with open("../data/PCA/All Processes-pca.json") as result:
    #result = {'success':'true','message':'The Command Completed Successfully'};
#    print 'Content-Type: application/json\n\n'
    #print(json.load(result))
#    print json.dumps(json.load(result))


print "Content-type: text/html\n"
print "<html>"
print filetype
print "</html>"
