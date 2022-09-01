const Users = require('../Models/User');
const Journals = require('../Models/Journal');
const Feeds = require('../Models/Feed');

async function sendFeed(user_id, journal) {
    let journal_id = journal._id;

    if (user_id == journal.creator_is) {
        return;
    }
    let new_feed = {
        target_id: user_id,
        content: journal.content
    }

    try {
        const feed = await new Feeds(new_feed)
        await feed.save()
            .then((res) => {
                const journal = Journal.findOne({ _id: journal_id });
                if (!journal) {
                    return;
                }
                Journal.updateOne({ _id: journal_id }, { shared: true })
            })
            console.log("Done 0");
    } catch (error) {
        console.log(error)
    }

}

async function sendFeedsToUser(temp_users, temp_journals) {
    let local_journal = temp_journals.filter(element => element.creator_id !== temp_users[0]._id);
    if (local_journal.length <= 0) {
        return
    }
    local_journal.forEach(element => {
        sendFeed(temp_users[0]._id, element);
    })
}

async function sendFeedToUsers(temp_users, temp_journals) {
    let local_users = temp_users.filter(element => element._id !== temp_journals[0].creator_id);
    if (local_users.length <= 0) {
        return
    }
    local_users.forEach(element => {
        sendFeed(element._id, temp_journal[0]);
    })
}




async function feedsService() {

    try {

        // get query Range TS
        let current_millis = Date.now();
        let prev_time = new Date(current_millis - (24 * 3600000))
        let current_time = new Date(current_millis)

        //get Journals made within the TS range 
        let temp_journals = await Journals.find({ shared: false, created_at: { $gt: prev_time, $lt: current_time } })
        //get users active within TS
        let temp_users = await Users.find({ last_entry: { $gte: prev_time, $lte: current_time } })

        //get Number of users & journals
        let users_count = temp_users.length
        let journals_count = temp_journals.length
        console.log(users_count, journals_count);
        let user_index = 0;
        let journal_index = 0;

        if (users_count === 1 && journals_count === 1) {
            await sendFeed(temp_users[0]._id, temp_journals[0]);
            return;
        }

        if (users_count === 1 && journals_count > 1) {
            await sendFeedsToUser(temp_users, temp_journals)
            return;
        }

        if (users_count > 1 && journals_count === 1) {
            await sendFeedToUsers(temp_users, temp_journals)
            return;
        }

        if (users_count > 1 && journals_count > 1) {
            if (users_count < journals_count) {
                while (temp_users.length > 1) {
                    
                    let local_user = temp_users[user_index]
                    let local_journal = temp_journals[journal_index]
                    if (local_user._id = local_journal.creator_id) {
                        journal_index = 1;
                    } else {
                        await sendFeed(temp_users[user_index]._id, temp_journals[journal_index]);
                        temp_journals.splice(journal_index, 1)
                        temp_users.splice(user_index, 1)
                        journal_index = 0
                        console.log("Done 2");
                    }
                }

                await sendFeedsToUser(temp_users, temp_journals)
                return
            }

            if (users_count > journals_count) {
                while (temp_journals.length > 1) {
                    let local_user = temp_users[user_index]
                    let local_journal = temp_journals[journal_index]
                    if (local_user._id = local_journal.creator_id) {
                        user_index = 1;
                    } else {
                        await sendFeed(temp_users[user_index]._id, temp_journals[journal_index]);
                        temp_journals.splice(journal_index, 1)
                        temp_users.splice(user_index, 1)
                        user_index = 0
                    }
                }
                await sendFeedToUsers(temp_users, temp_journals)
                return
            }

            if (users_count == journals_count) {
                temp_journals.splice(0, 1)
                while (temp_journals.length > 1) {
                    let local_user = temp_users[user_index]
                    let local_journal = temp_journals[journal_index]
                    if (local_user._id = local_journal.creator_id) {
                        user_index = 1;
                    } else {
                        await sendFeed(temp_users[user_index]._id, temp_journals[journal_index]);
                        temp_journals.splice(journal_index, 1)
                        temp_users.splice(user_index, 1)
                        user_index = 0
                    }
                }
                await sendFeedToUsers(temp_users, temp_journals)
                return
            }
        }
        return;
    } catch (error) {
        console.log(error)
    }

}

module.exports = { feedsService }