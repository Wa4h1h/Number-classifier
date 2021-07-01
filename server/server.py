from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
import io
from PIL import Image
from classifier import clf
import numpy as np
import matplotlib.pyplot as plt 


app = Flask(__name__)
CORS(app)




@app.route('/classify', methods=['POST'])
def classify():
    data = request.form['img']
    imgBytes=io.BytesIO(base64.b64decode(data[data.index(',')+1:]))
    img=Image.open(imgBytes)
    img_resized = img.resize( (8, 8), Image.LANCZOS )
    img_rescaled = np.interp(img_resized, (0,255), (15,0) )
    pixels_array = np.array(img_rescaled)[:,:,0].reshape( (1, 8*8) )
    return '%d' % clf.predict(pixels_array)



if __name__ == '__main__':
    app.run()
