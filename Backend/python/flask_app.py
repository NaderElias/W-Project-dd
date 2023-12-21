# flask_app.py
from flask import Flask, jsonify,request
import subprocess

app = Flask(__name__)

@app.route('/execute_python_script')
def execute_python_script():
    arg1 = request.args.get('arg1', 'default_value1')
    arg2 = request.args.get('arg2', 'default_value2')
    result = subprocess.check_output(['python', r'C:\Users\Nader Labib\Documents\Wpro\W-Project\Backend\python\predict.py',arg1,arg2]).decode('utf-8')
   
    return jsonify({'result': result.strip()})

if __name__ == '__main__':
    app.run(debug=True)
