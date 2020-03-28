import json
import re
def func():
  ans = ""
  file = open("C:/ResumesFolder/text/res.txt",encoding="utf8")
  ans = file.read()
  ans.rstrip()
  out = { "documents":[{"language":"en","id":"1","text":ans[:5000]}]}
  return json.dumps(out)
