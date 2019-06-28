from __future__ import absolute_import, division, print_function

import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split

tf.logging.set_verbosity(tf.logging.INFO)

def cnn_model_fn(features, labels, mode):
    """Model function for CNN."""
    # Input Layer
    input_layer = tf.reshape(features["x"], [-1, 150, 150, 3])

    # Convolutional Layer #1
    conv1 = tf.layers.conv2d(
        inputs=input_layer,
        filters=32,
        kernel_size=[5, 5],
        padding="same",
        activation=tf.nn.relu)

    # Pooling Layer #1  # (1, 75, 75, 32)
    pool1 = tf.layers.max_pooling2d(inputs=conv1, pool_size=[2, 2], strides=2)

    # Convolutional Layer #2
    conv2 = tf.layers.conv2d(
        inputs=pool1,
        filters=64,
        kernel_size=[5, 5],
        padding="same",
        activation=tf.nn.relu)

    # Pooling Layer #2 (1, 37, 37, 64)
    pool2 = tf.layers.max_pooling2d(inputs=conv2, pool_size=[2, 2], strides=2)

    # Convolutional Layer #3 # (1, 37, 37, 64)
    conv3 = tf.layers.conv2d(
        inputs=pool2,
        filters=128,
        kernel_size=[5, 5],
        padding="same",
        activation=tf.nn.relu)

    # Pooling Layer #2 (1, 18, 18, 128)
    pool3 = tf.layers.max_pooling2d(inputs=conv3, pool_size=[2, 2], strides=2)

    # Dense Layer shape=(1, 4, 10368)
    pool3_flat = tf.reshape(pool3, [-1, 4, 10368])

    # Dense Layer shape=(1, 4, 1024)
    dense = tf.layers.dense(inputs=pool3_flat, units=1024, activation=tf.nn.relu)
    dropout = tf.layers.dropout(
        inputs=dense, rate=0.4, training = mode == tf.estimator.ModeKeys.TRAIN)

    # Logits Layer (4 output color)  shape=(1, 4, 3)
    predicted_color = tf.layers.dense(inputs=dropout, units=3) 

    #predictions = logits
    predictions = {
        # Generate predictions (for PREDICT and EVAL mode)
        "classes": predicted_color,
        # Add `softmax_tensor` to the graph. It is used for PREDICT and by the
        # `logging_hook`.
        "probabilities": tf.nn.softmax(logits, name="softmax_tensor")
    }

    if mode == tf.estimator.ModeKeys.PREDICT:
      return tf.estimator.EstimatorSpec(mode=mode, predictions=predictions)

    # Calculate Loss (for both TRAIN and EVAL modes)
    #loss = tf.losses.sparse_softmax_cross_entropy(labels=labels, logits=logits)
    loss = tf.losses.mean_squared_error(labels=labels, predictions=predicted_color)

    # Configure the Training Op (for TRAIN mode)
    if mode == tf.estimator.ModeKeys.TRAIN:
      optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001)
      train_op = optimizer.minimize(
          loss=loss,
          global_step=tf.train.get_global_step())
      return tf.estimator.EstimatorSpec(mode=mode, loss=loss, train_op=train_op)

    # Add evaluation metrics (for EVAL mode)
    eval_metric_ops = {
        #"accuracy": tf.metrics.accuracy(
        #    labels=labels, predictions=predictions["classes"])
        "MSE": tf.metrics.mean_squared_error(
             labels=labels, predictions=predicted_color)
    }
    return tf.estimator.EstimatorSpec(
        mode=mode, loss=loss, eval_metric_ops=eval_metric_ops)

#----------------------------------------------------------------

# Load training and eval data

images = np.load('./ML_image/imagedata.npy')
colors = np.load('./ML_color/colorlabel.npy')

train_data, eval_data, train_labels, eval_labels = train_test_split(images, colors, test_size=0.2, random_state=0)

train_data = train_data/np.float32(255)
eval_data  = eval_data/np.float32(255)
#train_labels = train_labels.astype(np.int32)  # not required

#----------------------------------------------------------------

# Create the Estimator
color_predictor = tf.estimator.Estimator(
    model_fn=cnn_model_fn, model_dir="./color_predictor_model")

# Set up logging for predictions
tensors_to_log = {"probabilities": "softmax_tensor"}

logging_hook = tf.train.LoggingTensorHook(
    tensors=tensors_to_log, every_n_iter=50)

# Train the model
train_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"x": train_data},
    y=train_labels,
    batch_size=32,
    num_epochs=None,
    shuffle=True)

# train one step and display the probabilties
color_predictor.train(
    input_fn=train_input_fn,
    steps=1,
    hooks=[logging_hook])

color_predictor.train(input_fn=train_input_fn, steps=1000)

eval_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"x": eval_data},
    y=eval_labels,
    num_epochs=1,
    shuffle=False)

eval_results = color_predictor.evaluate(input_fn=eval_input_fn)

print(eval_results)
