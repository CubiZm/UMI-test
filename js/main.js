var simpleValidation = function(){
  
  var validateForm = $('form.form');

  validateForm.each(function(){
    var validateForm = $(this);
    var validate = {};
    var validateThis = $(this).find('.form__validate');
    var validatingLength = $(this).find('.form__validate').length;
    var submitBtn = $(this).find('.form__button');
    
    for(var i = 1; i <= validatingLength; i++){
      validate['input'+i] = false;
    }
    
    $('.submit').blur(function(){
      var index =  $(this).prevAll().length+1;
      var validateThisVal = $(this).val();
      var validateThisType = $(this).attr('type');
      
      if(validateThisType === "email"){
        
        // Email regex
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // Condition to see if Email exists
        if(!validateThisVal.match(re)){
          $(this).addClass('not-valid');
          $(this).removeClass('is-valid');
          return validate['input'+index] = false;
        } else{
          $(this).addClass('is-valid');
          $(this).removeClass('not-valid');
          return validate['input'+index] = true;
        }
      } else{
        // Makes sure input is filled out
        if(validateThisVal == ""){
          $(this).addClass('not-valid');
          $(this).removeClass('is-valid');
          return validate['input'+index] = false;
        } else{
          $(this).addClass('is-valid');
          $(this).removeClass('not-valid');
          return validate['input'+index] = true;
        }
      }
    });
    
    
    validateForm.submit(function(event){
      event.preventDefault();
      
      var falseCtn = 0;
      for(var i = 1; i <= validatingLength; i++){
        if(validate['input'+i] == false){
          falseCtn++;
        }
      }

      if(falseCtn > 0){
        $(this).unbind('submit').submit();
        $(this).click();
      } else{
      }
    });
    
  });
  
};

simpleValidation();