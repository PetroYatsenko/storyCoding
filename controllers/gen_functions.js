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
    case 'dashboard': 
      nextPath = '/lessons/dashboard';
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

exports.replaceButtonObj = {
  bt1: '<button type="button" class="btn btn-success btn-sm" id="h1">',
  bt2: '<button type="button" class="btn btn-success btn-sm" id="h2">',
  bt3: '<button type="button" class="btn btn-success btn-sm" id="h3">',
  bt4: '<button type="button" class="btn btn-success btn-sm" id="h4">',
  bt5: '<button type="button" class="btn btn-success btn-sm" id="h5">',
  bt6: '<button type="button" class="btn btn-success btn-sm" id="h6">',
  bt7: '<button type="button" class="btn btn-success btn-sm" id="h7">',
  bt8: '<button type="button" class="btn btn-success btn-sm" id="h8">',
  bt9: '<button type="button" class="btn btn-success btn-sm" id="h9">',
  bt10: '<button type="button" class="btn btn-success btn-sm" id="h10">',
  bt11: '<button type="button" class="btn btn-success btn-sm" id="h11">',
  bt12: '<button type="button" class="btn btn-success btn-sm" id="h12">',
  bt13: '<button type="button" class="btn btn-success btn-sm" id="h13">',
  bte: '</button>'    
};
