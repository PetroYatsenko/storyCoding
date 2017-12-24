// TODO Store paths within the database ?
exports.getNextPath = function(storyType = undefined) {
  var nextPath = '/'; // By default
  
  switch(storyType) {
    case 'lesson':
      nextPath = '/lessons/explanation';
      break;
    case 'explanation':
      nextPath = '/practice/heroes';
      break;
    case 'heroes':
      nextPath = '/practice/story_builder';
      break;
    case 'practice':
      nextPath = '/practice/story_builder/arrange';
      break;
    case 'arrange': 
      nextPath = '/practice/dashboard';
      break;
  }
  
  return JSON.stringify(nextPath);
};

exports.replacePlaceholders = function(val, str) {
  var replaced = "";
  var parts = str.split(/(\%\w+?\%)/g).map(function(v) {
    replaced = v.replace(/\%/g,"");
    return val[replaced] || replaced; 
  });

  return parts.join("");
};




