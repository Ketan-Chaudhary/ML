import os
import sys
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

# Set encoding to avoid UnicodeEncodeError
os.environ['PYTHONIOENCODING'] = 'utf-8'

# Load the model
model = load_model('handwriting_model.h5')

# Process the input image
image_path = sys.argv[1]
img = Image.open(image_path).convert('L')
img = img.resize((28, 28))  # Resize to 28x28 pixels
img = np.array(img)
img = img.reshape(1, 28, 28, 1) / 255.0  # Normalize to [0,1] range

# Predict the digit
prediction = model.predict(img)
predicted_digit = np.argmax(prediction)

# Print the predicted digit (this will be captured by the Node.js server)
print(predicted_digit)
