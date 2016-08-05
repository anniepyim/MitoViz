#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json

# re for json files
FNRE = re.compile("\S+\.json$")

form = cgi.FieldStorage()
json_files = form.getlist('file_list')

# fname safety check

for fn in json_files:
    if not re.match(FNRE, fn):
        sys.exit(-1)


cmd = "/usr/local/bin/Rscript R/test.R "  + ' '.join(json_files)
os.system(cmd)

with open("data/PCA/All Processes-pca.json") as result:
    #result = {'success':'true','message':'The Command Completed Successfully'};
    print 'Content-Type: application/json\n\n'
#data =  json.load(result)
    #print(data)
    print json.dumps(json.load(result))


#print "Content-type: text/html\n"
#print "<html>"
#print "fds"
#print "</html>"

