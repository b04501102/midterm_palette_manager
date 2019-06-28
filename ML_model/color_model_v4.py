from __future__ import absolute_import, division, print_function

from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter
from PIL import Image
from sklearn.model_selection import train_test_split

def RGB2HEX(color):
    return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))

#----------------------------------------------------------------
# Load training and eval data

images = np.load('./ML_image/imagedata.npy')
colors = np.load('./ML_color/colorlabel.npy')

train_data   = images.reshape(-1, images.shape[1]*images.shape[2], 3)
train_labels = colors
#----------------------------------------------------------------

# Create the Estimator

clf = KMeans(n_clusters = 4)
predict_labels = clf.fit_predict(train_data[0])
counts = Counter(predict_labels)
center_colors = clf.cluster_centers_

print('train_labels[0]', train_labels[0])

ordered_colors = [center_colors[i] for i in counts.keys()]
hex_colors = [RGB2HEX(ordered_colors[i]) for i in counts.keys()]
rgb_colors = [ordered_colors[i] for i in counts.keys()]

hex_colors_real = [RGB2HEX(train_labels[0][i]) for i in range(4)]

im = Image.fromarray(images[0].astype('uint8'))

fig = plt.figure(figsize = (30, 30))
fig, axs = plt.subplots(1, 3)
axs[0].set_title("Original Image")
axs[0].imshow(im)
axs[1].set_title("Clustering")
axs[1].pie(counts.values(), labels = hex_colors, colors = hex_colors)
axs[2].set_title("Crawler")
axs[2].pie(counts.values(), labels = hex_colors_real, colors = hex_colors_real)
plt.show()

print('hex_colors', hex_colors)

#predict_img = eval_data*np.float32(255)
#
#predicolor_path = "./ML_color/predict/color.csv"
#
#for i in range(len(predict_img)):
#    imgurl_path = "./ML_image/predict/img_"+str(i)+".png"
#    print('Saving data ', imgurl_path)
#    im = Image.fromarray(predict_img[i].astype('uint8'))
#    im.save(imgurl_path)
#
#with open(predicolor_path,"w") as f:
#        f.write('Real hex'+','+'Predicted hex'+'\n')
#        for i in range(len(eval_predict)):
#            HEX_pre  = RGB2hex(eval_predict[i])
#            print('HEX_pre', HEX_pre)
#            HEX_real = RGB2hex(eval_labels[i])
#            print('HEX_real', HEX_real)
#            f.write(str(HEX_real[0])+','+str(HEX_real[1])+','+str(HEX_real[2])+','+str(HEX_real[3])+',')
#            f.write(str(HEX_pre[0])+','+str(HEX_pre[1])+','+str(HEX_pre[2])+','+str(HEX_pre[3])+',')
#            f.write('\n')
