const express = require('express');
const newsr = express.Router();
const axios = require('axios')
const { parse } = require('rss-to-json');
const sanitizeHtml = require('sanitize-html');

newsr.get('/', async (req, res) => {

    // News API
    const newsURL = [
        "https://www.manilatimes.net/news/national/feed/",
        "https://www.manilatimes.net/sports/feed/",
        "https://www.manilatimes.net/regions/feed/",
        "https://www.manilatimes.net/entertainment-lifestyle/feed/",
        "https://www.manilatimes.net/business/feed/",
        "https://www.manilatimes.net/opinion/feed/"
    ];

    // Load all the news API data 
    try {
        let data = await fetchDataFromAPI(newsURL, isRss = true);
        let featuredNews = data.map(news => {
            return {
                category: news.description.split(":")[1].trim(),
                link: news.link,
                items: news.items.reduce((filtered, item) => {
                    if (filtered.length < 5 && item.media && item.media.thumbnail) {
                        filtered.push({
                            title: sanitizeHtml(item.title, {
                                allowedTags: [],
                                allowedAttributes: {}
                            }),
                            description: sanitizeHtml(item.description, {
                                allowedTags: [],
                                allowedAttributes: {}
                            }).replace(/\n+/g, ' ').trim(),
                            url: item.link,
                            date_published: new Date(item.published).toLocaleString(),
                            thumbnail: {
                                image_url: item.media.thumbnail.url
                            }
                        });
                    }

                    return filtered;
                }, [])
            };
        });
        console.log(featuredNews)   // Debug
        res.render("news", { featuredNews: featuredNews, currentDate: getCurrentDate() })
    } catch (error){
        console.error("Error fetching data: " + error);
        throw error;
    }
})

// Private functions
async function fetchDataFromAPI(urls, isRss = false){
    try {
        
        // Create an array of promises
        const promises = urls.map(urls => {
            return (isRss) ? parse(urls) : fetch(urls);
        })

        // Gets all the data from api before returning result
        const results = await Promise.all(promises);
        return results;
    } catch (error){
        console.error("Error fetching data: " + error);
        throw error;
    }
}

function getCurrentDate(){
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let currentDate = new Date();
    let day = daysOfTheWeek[currentDate.getDay()];
    let month = months[currentDate.getMonth()];
    let date = currentDate.getDate();
    let year = currentDate.getFullYear();

    return day + ", " + month + " " + date + ", " + year;
}

module.exports = newsr;