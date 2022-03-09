import pandas as pd
import sys, json
import keras

def prepare_data(arr):
    return sum(arr)
  
data = json.loads(sys.argv[1])
  
array = data['array']
  
# Calculate the result
result = arraysum(array)
  
newdata = {'sum':result}
print(json.dumps(newdata))