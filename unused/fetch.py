#! /usr/bin/env python3


from bs4 import BeautifulSoup as bs
import json, requests

checklist = requests.get("https://iq.opengenus.org/100-interview-problems/").text

checklist_page = bs(checklist, 'html.parser')

checklist = []
containers = checklist_page.find_all(class_="checklist")

for container in containers:
    container_title = container.find(class_="checklist__title").get_text()
    checklist.append({"checklist_title": container_title, "sub_titles": []})
    container_items = container.find_all(class_="checklist-item")
    for item in container_items:
        item_title = item.find(class_="checklist-item__title").get_text()
        item_info = str(item.find(class_="info"))[18:-6].strip()
        checklist[-1]["sub_titles"].append({"title": item_title, "info": item_info})

with open("checklist.json", "w") as file:
    file.write(json.dumps(checklist))

