#!/usr/bin/env python
# coding: utf-8

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import numpy as np
from PIL import *
import PIL.Image
import urllib.request

# browser = webdriver.PhantomJS()
# browser = webdriver.Chrome('./chromedriver')

def crawler_for_canva(page):
    crawler_dataurl = []
    crawler_color = []
    url = 'https://www.canva.com/colors/color-palettes/page/'+str(page)+'/'
    req = requests.get(url)
    html = BeautifulSoup(req.text, 'html.parser')
    palette_doms = html.select('._29HDjja6g0e0N8k5QWcO1M .xY7_KfdaS7zpEuJfKuf85')
    for dom in palette_doms:
        #browser = webdriver.Chrome('./chromedriver')
        webdriver.Firefox()
        req = browser.get(dom['href'])
        try:
            WebDriverWait(browser, 20, 0.5)
            html = BeautifulSoup(browser.page_source)
            palette_img = html.select('._3RglE75R_evD6QRxTWNucK img')[0]['src']
            palette_colors = list(map(lambda c: c.text, html.select('._3RglE75R_evD6QRxTWNucK ._1yUQhyfASvrL_734vanm6r ._1xfkYQjjEj9ulTlD7Aj2Nw')))
            if (palette_colors != None and palette_img.find(".png")!= -1):
                crawler_dataurl.append(palette_img)
                crawler_color.append(palette_colors)
                print("palette_colors:")
                print(palette_colors)
                print("palette_img:")
                print(palette_img)
        finally:
            browser.close()
    return crawler_dataurl, crawler_color

import pymongo

client = pymongo.MongoClient('mongodb://rainforest:abcd1234@140.112.253.162:32768/admin')
db = client.admin
collection = db.MLData

def insert_to_mongodb(data):
    collection.insert_many(map(lambda d: {
        'image': d[-1],
        'colors': d[:-1]
    }, data))

def save_image(dataurl, color, num):
    color_path  = "./ML_color/color_"+str(num-1)+".csv"
    with open(color_path,"w") as f:
        for i in range(len(color)):
            for j in range(len(color[i])):
                f.write(str(color[i][j])+',')
            f.write('\n')
    f.close()

    for i in range(len(dataurl)):
        #imgurl_path = "./ML_image/img_"+str((num-1)*40+i)+".png"
        imgurl_path = "./ML_image/img_"+str(num-1)+"_"+str(i)+".png"
        urllib.request.urlretrieve(dataurl[i], imgurl_path)


for i in range(1, 100):
    crawler_dataurl, crawler_color = crawler_for_canva(i)
    save_image(crawler_dataurl, crawler_color, i)

