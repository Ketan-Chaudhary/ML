import pickle
import sys
from PIL import Image
import numpy as np

# Load the saved model
with open('enhanced_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Preprocess the uploaded image
img_path = sys.argv[1]
img = Image.open(img_path).convert('L')  # Convert to grayscale
img = img.resize((28, 28))  # Resize to 28x28 pixels
img = np.array(img).reshape(1, 28, 28, 1) / 255.0  # Reshape and normalize

# Make the prediction
prediction = model.predict(img)
predicted_digit = np.argmax(prediction)

print(predicted_digit)
