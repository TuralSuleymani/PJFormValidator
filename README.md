# (PJFormValidator)Pure Javascript Form Validator

PJFormValidator allows you to validate any HTML Forms.

### How to use

Before using you must mark all you input elements as validatable. There are by default 7 rules for validation.
```
          'required' : 'Input cant be empty',
          'min-len-' : 'Minimum length of the input must be `x`',
          'max-len-' : 'Maximum length of the input must be `x`',
          'num-min-' : 'Minimum size of number must be `x`',
          'num-max-' : 'Maximum size of number must be `x`',
          'number' : 'Must be only number!!',
          'email' : "Email is not valid"
```
  You can use one of them or more than one for every input element.
  Also your inputs must contain data-validation-error atrribute. This attribute allows you to show validation errors for given input.
```
 <form id="validatable-form">
        <div class="form-group">
            <label>Please enter your name</label>
            <input type="text" class="form-control required min-len-2 max-len-16 mx-m-4" data-validation-error="sp-1">
            <div id="sp-1"></div>
        </div>
        <div class="form-group">
            <label>Please enter your surname</label>
            <input type="text" class="form-control required min-len-2 max-len-16" data-validation-error="sp-2">
            <div id="sp-2"></div>
        </div>
        <div class="form-group">
            <label>Please enter your age</label>
            <input type="text" class="form-control number required num-min-8 num-max-19" data-validation-error="sp-3">
            <div id="sp-3"></div>
        </div>
        <div class="form-group">
            <label>Please enter your email</label>
            <input type="text" class="form-control required email" data-validation-error="sp-4">
            <div id="sp-4"></div>
        </div>
        <button id="btn_validate" class="btn btn-success">Validate</button>
    </form>
```

### After HTML configuring

After configuring your can set language for errors. By default validator supports ru, en and az languages.
Every form element must contain id attribute.Because validation applies via form attribute.
```
                validator.configLanguage('az');// 'ru' or 'en'
                validator.validateForm('validatable-form');// the form id
```

### Addind additional rules

If you need, you can add your custom validation rules.
```
                  validator.addValidationConfiguration('az', 'mx-m-', 'error message for this rule');
                 validator.addValidationRule('mx-m-', function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (true) {
                        this._sendErrorToElement('mx-m-', errorOn, errorMessage);
                    }
                });
```

## Authors

* **Suleymani Tural**  - [brain2brain.net](https://brain2brain.net/az/Home/Authors)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


