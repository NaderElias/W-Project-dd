import sys
import pickle
from pathlib import Path
import pandas as pd
if len(sys.argv) < 3:
        print("Usage: python example.py arg1 arg2")
        sys.exit(1)

    # Retrieve arguments
arg1 = sys.argv[1]
arg2 = sys.argv[2]
def predict():
   
    HERE = Path(__file__).parent
  
    # load the model 
    model = pickle.load(open(HERE / "./model/model.pkl","rb"))
    type_label_encoder = pickle.load(open(HERE / "./model/type_label_encoder.pkl","rb"))
    prio_label_encoder = pickle.load(open(HERE / "./model/prio_label_encoder.pkl","rb"))

    # example data for prediction
    
        
    new_data = [[type_label_encoder.transform([arg1])[0], prio_label_encoder.transform([arg2])[0]]]  # replace with actual feature values

    # make predictions
    predictions = model.predict_proba(new_data)
    probabilty = {}

    for i, probs in enumerate(predictions):
        
        for j, class_label in enumerate(model.classes_):
            probabilty[class_label] = probs[j] * 100
        
    
    return probabilty

predictions = predict()
print(predictions)

