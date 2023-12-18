import sys
import pickle
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

HERE = Path(__file__).parent
arg1 = sys.argv[1]
arg2 = sys.argv[2]
  
# load the model
model = pickle.load(open(HERE / "model.pkl","rb"))
type_label_encoder = pickle.load(open(HERE / "type_label_encoder.pkl","rb"))
prio_label_encoder = pickle.load(open(HERE / "prio_label_encoder.pkl","rb"))

# example data for prediction
new_data = [[type_label_encoder.transform([arg1])[0], prio_label_encoder.transform([arg2])[0]]]  # replace with actual feature values

# make predictions
predictions = model.predict_proba(new_data)

for i, probs in enumerate(predictions):
    print(f"Instance {i + 1}:")
    for j, class_label in enumerate(model.classes_):
        print("  Probability for "+class_label+":", probs[j] * 100)
    print("\n")
# sys.stdout.flush()