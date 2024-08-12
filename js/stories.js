"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


function deleteButtonMarkup(){
  return `<span class="trash-can"> <i class="fas fa-trash"></i> </span>`
}


function starButtonMarkup(story, user){
  const liked = user.isLiked(story)
  let starType = "";
  if(liked === true){
    starType = 'fas' 
  }
  else{
    starType = 'far'
  }

  return `<span class="star" <i class="${starType} fa-star"></i> </span> `
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const loggedIn = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      <div>
        ${showDeleteButton ? deleteButtonMarkup() : ''}
        ${loggedIn ? starButtonMarkup(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function addStoryHandler(evt){
  evt.preventDefault();
  const title = $storyTitle.val();
  const author = $storyAuthor.val();
  const url = $storyURL.val();
  // console.log(title, "title")
  // console.log(author, "author")
  // console.log(url, "url")
  const storyData = {title, author, url};
  const story = await storyList.addStory(currentUser, storyData);
  putStoriesOnPage();
}




async function removeStory(evt){
  evt.preventDefault();
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}




function userStories(){
$allStoriesList.empty();
if(currentUser.ownStories.length === 0){
  $allStoriesList.append("<div> no user stories yet </div>");
}
else{
  for(let i = 0; i < currentUser.ownStories.length; i++){
    let story = currentUser.ownStories[i];
    let $story = generateStoryMarkup(story, true);
    $allStoriesList.append($story);
  }
}
$allStoriesList.show();
};




function favoriteStories(){
  $allStoriesList.empty();
  if(currentUser.favorites.length === 0){
    $allStoriesList.append("<div> no favorite stories yet </div>");
  }
  else{
    for(let i = 0; i < currentUser.favorites.length; i++){
      let story = currentUser.favorites[i];
      let $story = generateStoryMarkup(story, true);
      $allStoriesList.append($story);
    }
  }
  $allStoriesList.show();
  };


$myStories.on("click", ".trash-can", removeStory);

$addStoryForm.on("submit", addStoryHandler);