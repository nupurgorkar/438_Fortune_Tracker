# Introduction
The purpose of this web application is to allow users who enjoy collecting and journalling to combine their interests. Essentially, it allows them to keep track of different introspective fortunes, and reflect on them later. The user can view their fortunes and reflections in the archives page, and also view their favorite fortunes on the favorites page. This application has used HTML/CSS, JavaScript, React, Vite, and Firebase. 

# DailyQuote Component
DailyQuote.jsx contains the code for the entire homepage. This application takes a list of 25 fortunes in data/fortunes.js and displays a random one to the user, which they can save once daily. Additionally, the user can also choose to manually submit their own fortune that they may have gotten on a cookie in real life. In the future, I would structure this file differently, and split it up into 3 different components (one for manual submit, one for daily quotes, and one for the cards).

# Future Developments
Currently, all fortunes on this app are stored to one user. In the future, I plan on doing some sort of authentification or having per-device refresh settings. 
