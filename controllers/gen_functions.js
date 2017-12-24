// TODO Store paths within the database ?
exports.getNextPath = function(storyType) {
  var path = '/lessons/dashboard'; //By default
  
  switch(storyType) {
    case 'practice':
      path = '/practice/story_builder/arrange';
      break;
    case 'explanation':
      path = '/practice/heroes';
      break;
    case 'lesson':
      path = '/lessons/explanation';
      break;
  }
  
  return JSON.stringify(path);
};

exports.replacePlaceholders = function(val, str) {
  var replaced = "";
  var parts = str.split(/(\%\w+?\%)/g).map(function(v) {
    replaced = v.replace(/\%/g,"");
    return val[replaced] || replaced; 
  });

  return parts.join("");
};




