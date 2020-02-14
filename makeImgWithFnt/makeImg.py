#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "Damon"
# Date: 2020/2/14

from PIL import Image, ImageDraw, ImageFont, ImageEnhance

font_size = 8
text = "小可爱！"
img_path = "E://testMakeImg/1.jpg"
img_data = Image.open(img_path)
img_data = ImageEnhance.Color(img_data).enhance(1.2)
img_data = ImageEnhance.Brightness(img_data).enhance(1.2)
img_data = ImageEnhance.Contrast(img_data).enhance(1.2)
img_data = ImageEnhance.Sharpness(img_data).enhance(1.1)

img_data.save("E://testMakeImg/3.jpg")

img_data = Image.open("E://testMakeImg/3.jpg")
img_array = img_data.load()

img_new = Image.new("RGB", img_data.size, (80, 80, 80))
draw = ImageDraw.Draw(img_new)
font = ImageFont.truetype('C:/Windows/Fonts/微软雅黑/msyhl.ttc', font_size)


def character_generator(text):
    while True:
        for i in range(len(text)):
            yield text[i]


ch_gen = character_generator(text)

for y in range(0, img_data.size[1], font_size):
    for x in range(0, img_data.size[0], font_size):
        draw.text((x, y), next(ch_gen), font=font, fill=img_array[x, y], direction=None)

img_new.convert('RGB').save("E://testMakeImg/2.jpg")
