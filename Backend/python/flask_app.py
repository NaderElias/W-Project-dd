# flask_app.py
from flask import Flask, jsonify,request
import subprocess
from pathlib import Path

app = Flask(__name__)
HERE = Path(__file__).parent

@app.route('/execute_python_script')
def execute_python_script():
    arg1 = request.args.get('arg1', 'default_value1')
    arg2 = request.args.get('arg2', 'default_value2')
    result = subprocess.check_output(['python', HERE / './predict.py',arg1,arg2]).decode('utf-8')
   
    return jsonify({'result': result.strip()})

if __name__ == '__main__':
    app.run(debug=True)
