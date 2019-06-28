
import numpy as np
from PIL import *
import PIL.Image
import pandas as pd

def hex2RGB(hex):
    h0 = hex[0].lstrip('#')
    h1 = hex[1].lstrip('#')
    h2 = hex[2].lstrip('#')
    h3 = hex[3].lstrip('#')
    h0_ = tuple(int(h0[i:i+2], 16) for i in (0, 2, 4))
    h1_ = tuple(int(h1[i:i+2], 16) for i in (0, 2, 4))
    h2_ = tuple(int(h2[i:i+2], 16) for i in (0, 2, 4))
    h3_ = tuple(int(h3[i:i+2], 16) for i in (0, 2, 4))
    RGB = [h0_, h1_, h2_, h3_]
    return RGB

color_map = []
img_map = []

for num in range(100):
    color_path  = "./ML_color/color_"+str(num)+".csv"
    print(color_path)
    color_total = pd.read_csv(color_path, header=None, usecols=[0,1,2,3])
    for i in range(40):
        color_hex = color_total.loc[i].tolist()
        color_RGB = hex2RGB(color_hex)
        imgurl_path = "./ML_image/img_"+str(num)+"_"+str(i)+".png"
        print(imgurl_path)
        img = Image.open(imgurl_path).convert("RGB")
        img = img.resize((150, 150), Image.ANTIALIAS)
        img_array = np.array(img)
        color_map.append(color_RGB)
        img_map.append(img_array)

color_map = np.array(color_map)
print("color_map.shape:", color_map.shape)
img_map = np.array(img_map)
print("img_map.shape:", img_map.shape)

colorlabel_path = "./ML_color/colorlabel.npy"
img_path        = "./ML_image/imagedata.npy"

np.save(colorlabel_path, color_map)
np.save(img_path, img_map)
