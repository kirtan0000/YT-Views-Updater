const updateYouTubeVideo = (e = null) => {
    const id = "nUfDiMpJhjU";
    const channelid = "UCMu1ymcvAKh56Rn11kQQ9RQ";
    // Put your video id and channel id here :)

    const template = "This video has VIEWCOUNT views, COMMENTCOUNT comments, and LIKECOUNT likes";

    // The cron job is created only when the script is run manually
    if (e === null) {
        const triggerName = "updateYouTubeVideo";
        const triggers = ScriptApp.getProjectTriggers().filter((trigger) => {
            return trigger.getHandlerFunction() === triggerName;
        });

        // If time based trigger doesn't exist, create one that runs every 5 minutes
        if (triggers.length === 0) {
            ScriptApp.newTrigger(triggerName).timeBased().everyMinutes(5).create();
        }
    }

    // Get the watch statistics of the video
    const {
        items: [video = {}] = []
    } = YouTube.Videos.list(
        "snippet,statistics", {
            id
        }
    );

    // Get my subscriber amount
    const {
        items: [channel = {}] = []
    } = YouTube.Channels.list(
        "statistics", {
            id: channelid
        }
    );

    // Parse the YouTube API response to get views and comment count
    const {
        snippet: {
            title: oldTitle,
            categoryId
        } = {},
        statistics: {
            viewCount,
            commentCount,
            likeCount
        } = {}
    } = video;

    // Parse my subscriber data
    const {
        statistics: {
            subscriberCount
        } = {}
    } = channel;

    var afterData = "Right Now, This video currently has " + viewCount + " views, " + commentCount + " comments, and " + likeCount + " likes.\nCode: https://github.com/kirtan0000/YT-Views-Updater\n\n\nplz subscribe i have only " + subscriberCount + " subscribers😢";

    if (viewCount && commentCount && likeCount) {

        video.snippet.description = afterData;

        const newTitle = template
            .replace("VIEWCOUNT", viewCount)
            .replace("COMMENTCOUNT", commentCount)
            .replace("LIKECOUNT", likeCount);

        // If the video title has not changed, skip this step
        if (oldTitle !== newTitle) {
            YouTube.Videos.update({
                    id: id,
                    snippet: {
                        title: newTitle,
                        categoryId,
                        description: afterData
                    },
                },
                "snippet"
            );
        }
    }
};
