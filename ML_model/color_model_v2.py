from __future__ import absolute_import, division, print_function

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from PIL import Image
from sklearn.model_selection import train_test_split
#import tensorflow.contrib.slim as slim

sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))

def cnn_model():
    model = keras.Sequential()

    # Convolutional Layer #1 (1, 150, 150, 3)
    model.add(layers.Conv2D(
        filters=32, 
        kernel_size=(5, 5), 
        padding='same', 
        input_shape=(150, 150, 3), 
        activation='relu'))

    # Pooling Layer #1  # (1, 75, 75, 32)
    model.add(layers.MaxPooling2D(pool_size=(2, 2)))

    # Convolutional Layer #2 (1, 75, 75, 64)
    model.add(layers.Conv2D(
        filters=64, 
        kernel_size=(5, 5), 
        padding='same',  
        activation='relu'))

    # Pooling Layer #2 (1, 37, 37, 64)
    model.add(layers.MaxPooling2D(pool_size=(2, 2)))

    # Convolutional Layer #3 (1, 37, 37, 128)
    model.add(layers.Conv2D(
        filters=128, 
        kernel_size=(5, 5), 
        padding='same',  
        activation='relu'))

    # Pooling Layer #2 (1, 18, 18, 128)
    model.add(layers.MaxPooling2D(pool_size=(2, 2)))

    # Dense Layer shape=(1, 4, 10368)
    model.add(layers.Reshape((4, 10368)))

    # Dense Layer shape=(1, 4, 1024)
    model.add(layers.Dense(1024, activation='relu'))

    model.add(layers.Dense(256, activation='relu'))

    # Dense Layer shape=(1, 4, 3)
    model.add(layers.Dense(3, activation='relu'))
    
    model.summary()
    return model

def RGB2hex(RGB):
    h0 = RGB[0]
    h1 = RGB[1]
    h2 = RGB[2]
    h3 = RGB[3]
    h0_ = "#{:02x}{:02x}{:02x}".format(int(h0[0]), int(h0[1]), int(h0[2]))
    h1_ = "#{:02x}{:02x}{:02x}".format(int(h1[0]), int(h1[1]), int(h1[2]))
    h2_ = "#{:02x}{:02x}{:02x}".format(int(h2[0]), int(h2[1]), int(h2[2]))
    h3_ = "#{:02x}{:02x}{:02x}".format(int(h3[0]), int(h3[1]), int(h3[2]))
    HEX = [h0_, h1_, h2_, h3_]
    return HEX

#def model_summary():
#    model_vars = tf.trainable_variables()
#    slim.model_analyzer.analyze_vars(model_vars, print_info=True)

#----------------------------------------------------------------

# Load training and eval data

images = np.load('./ML_image/imagedata.npy')
colors = np.load('./ML_color/colorlabel.npy')

train_data, eval_data, train_labels, eval_labels = train_test_split(images, colors, test_size=0.2, random_state=0)

train_data   = train_data/np.float32(255)
eval_data    = eval_data/np.float32(255)
train_labels = train_labels/np.float32(255)
#eval_labels  = eval_labels/np.float32(255)

#----------------------------------------------------------------

# Create the Estimator
color_predictor = cnn_model()
color_predictor.compile(optimizer=tf.train.AdamOptimizer(0.01),
                        loss='mse',       # mean squared error
                        metrics=['mae'])  # mean absolute error

with tf.Session() as sess:
    color_predictor.fit(train_data, train_labels, epochs=2, batch_size=32)
    color_predictor.save_weights(
                    "/tmp/model.h5",
                    overwrite=True)

    #model.save(sess, "/tmp/model.ckpt")
    #print("Model saved in path: %s" % save_path)

    eval_predict = color_predictor.predict(eval_data)
    eval_predict = eval_predict*np.float32(255)

    predict_img = eval_data*np.float32(255)

    predicolor_path = "./ML_color/predict/color.csv"

    for i in range(len(predict_img)):
        imgurl_path = "./ML_image/predict/img_"+str(i)+".png"
        print('Saving data ', imgurl_path)
        im = Image.fromarray(predict_img[i].astype('uint8'))
        im.save(imgurl_path)

    with open(predicolor_path,"w") as f:
            f.write('Real hex'+','+'Predicted hex'+'\n')
            for i in range(len(eval_predict)):
                HEX_pre  = RGB2hex(eval_predict[i])
                HEX_real = RGB2hex(eval_labels[i])
                f.write(str(HEX_real[0])+','+str(HEX_real[1])+','+str(HEX_real[2])+','+str(HEX_real[3])+','))
                f.write(str(HEX_pre[0])+','+str(HEX_pre[1])+','+str(HEX_pre[2])+','+str(HEX_pre[3])+','))
                f.write('\n')
