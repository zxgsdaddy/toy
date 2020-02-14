#! /usr/bin/env python
# -*- coding: utf-8 -*-
# __author__ = "Damon"
# Date: 2020/2/14

from PIL import Image, ImageDraw, ImageFont, ImageEnhance

img_path = ""
while not img_path:
    print("输入图片绝对路径及文件名（例如'E://testMakeImg/1.jpg'，或者把图片和成程序放在同一个文件夹下'./1.jpg'）")
    # img_path = "E://testMakeImg/1.jpg"
    img_path = input()
print("输入组成图片的文字（默认：爱你）")
text = input() or "爱你"
print("输入文字大小（建议8-16 默认：12）")
font_size = int(input() or 12)
print("图片饱和度调整（范围0-2）不改变的话直接回车键")
enhance_color = float(input() or 1)
print("图片亮度调整（范围0-2）不改变的话直接回车键")
enhance_brightness = float(input() or 1)
print("图片对比度调整（范围0-2）不改变的话直接回车键")
enhance_contrast = float(input() or 1)
print("图片锐度调整（范围0-2）不改变的话直接回车键")
enhance_sharpness = float(input() or 1)
print("背景填充灰度（范围0-255）不输入的话是黑色")
bg_gray = int(input() or 0)
print("请耐心等待...")

img_data = Image.open(img_path)
img_data = ImageEnhance.Color(img_data).enhance(enhance_color)
img_data = ImageEnhance.Brightness(img_data).enhance(enhance_brightness)
img_data = ImageEnhance.Contrast(img_data).enhance(enhance_contrast)
img_data = ImageEnhance.Sharpness(img_data).enhance(enhance_sharpness)

img_data.save("./3.jpg")

img_data = Image.open("./3.jpg")
img_array = img_data.load()

img_new = Image.new("RGB", img_data.size, (bg_gray, bg_gray, bg_gray))
draw = ImageDraw.Draw(img_new)
font = ImageFont.truetype('./msyhl.ttc', font_size)


def character_generator(text):
    while True:
        for i in range(len(text)):
            yield text[i]


ch_gen = character_generator(text)

for y in range(0, img_data.size[1], font_size):
    for x in range(0, img_data.size[0], font_size):
        draw.text((x, y), next(ch_gen), font=font, fill=img_array[x, y], direction=None)

img_new.convert('RGB').save("./2.jpg")
