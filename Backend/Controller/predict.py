import sys
import pickle
from pathlib import Path
import numpy as np
HERE = Path(__file__).parent



#if __name__ == "__main__":
arg1 = "hardware"#sys.argv[1]
arg2 = "high"#sys.argv[2]
  
print("hello")
# load the model
model = pickle.load(open(HERE / "modelpred.pkl","rb"))

# example data for prediction
new_data = [[arg1, arg2]]  # replace with actual feature values

# make predictions
predictions = model.predict(new_data)
for i, probs in enumerate(predictions):
    print(f"Instance {i + 1}:")
    for j, class_label in enumerate(model.classes_):
        print(f"  Probability for {class_label}: {probs[j] * 100:.2f}%")
    print("\n")
sys.stdout.flush()