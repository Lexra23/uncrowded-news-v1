parse('https://www.manilatimes.net/news/feed/').then(rss => {
    const extractedItems = rss.items.map(item => ({
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
            image_url: item.media && item.media.thumbnail ? item.media.thumbnail.url : "https://placehold.co/600x400?text=No+Image" // Check if media and thumbnail exist
        }
    }));

    res.render('news', {items: extractedItems});
});