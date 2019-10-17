let validationConfig = {
    isLangExists: function(lang) {
        let isExists = false;
        for (let _lang in this.langs) {
            if (_lang == lang) {
                isExists = true;
                break;
            }
        }
        return isExists;
    },
    addValidationConfiguration: function(lang, configClass, errorMessage) {
        if (!this.isLangExists(lang))
            throw new Error('given language is not exists');
        this.langs[lang][configClass] = errorMessage;
    },
    getRuleValueByLang: function(lang, rulename) {
        return this.langs[lang][rulename];
    },
    langs: {
        az: {
            'required': 'Xana boş ola bilməz!!',
            'min-len-': 'Sözün uzunluğu minimum `x` olmalıdır',
            'max-len-': 'Sözün uzunluğu maksimum `x` olmalıdır',
            'num-min-': 'Ədədin minimum dəyəri `x` olmalıdır',
            'num-max-': 'Ədədin maksimal dəyəri `x` olmalıdır',
            'number': 'Ədəd olmalıdır',
            'email': "Email duzgun deyil"
        },
        ru: {
            'required': 'Поля должен быть заполнено',
            'min-len-': 'Минимальный длина слова должен быть `x`',
            'max-len-': 'Максимальная длина слова должен быть `x`',
            'num-min-': 'Минимальная значения число должен быть `x`',
            'num-max-': 'Максимальная значения число должен быть `x`',
            'number': 'Должен быть число',
            'email': "неправильно указан email"
        },
        en: {
            'required': 'Input cant be empty',
            'min-len-': 'Minimum length of the input must be `x`',
            'max-len-': 'Maximum length of the input must be `x`',
            'num-min-': 'Minimum size of number must be `x`',
            'num-max-': 'Maximum size of number must be `x`',
            'number': 'Must be only number!!',
            'email': "Email is not valid"
        }
    }
};

function Validator(validationConfig) {
    this._lang = 'en';
    this._validationConfig = validationConfig;

    this._isLangExists = function(lang) {
        return this._validationConfig.isLangExists(lang);
    }

    this.addValidationConfiguration = function(lang, configClass, errorMessage) {
        this._validationConfig.addValidationConfiguration(lang, configClass, errorMessage);
    }

    this.addValidationRule = function(ruleName, callback) {
        this._rules.ruleTypes[ruleName] = callback;
    }

    this.configLanguage = function(lang) {
        if (!this._isLangExists(lang)) {
            throw new Error("Given language doesnt exist!");
        }
        this._lang = lang;
    }

    this._getRule = function(ruleName) {
        let _innerRule = null;
        for (let f in this._rules.ruleTypes) {
            if (ruleName.includes(f)) {
                _innerRule = f;
                break;
            }
        }
        return _innerRule;
    }

    this._rules = {
            executeRule: function(ruleName, value, errorOn, formalizedErrorMessage, ruleValue) {
                this.ruleTypes[ruleName](value, errorOn, formalizedErrorMessage, ruleValue);
            },
            ruleTypes: {
                _createErrorContainer: function(key, errorMessage) {
                    let errorSpan = document.createElement('span');
                    errorSpan.className = `error-${key}`;
                    errorSpan.innerText = errorMessage;
                    return errorSpan;
                },
                _isNotaNumber: function(val) {
                    return isNaN(Number(val));
                },
                _isEmpty: function(val) {
                    return (!val || 0 === val.length);
                },
                _isValidEmail: function(email) {
                    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return pattern.test(email);
                },
                _IsTrue: function(callback) {
                    if (callback())
                        return true;
                    else return false;
                },
                _sendErrorToElement: function(className, errorOn, errorMessage) {
                    let errorSpan = this._createErrorContainer(className, errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                },
                'number': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isNotaNumber(originalValue)) {
                        this._sendErrorToElement('number', errorOn, errorMessage);
                    }
                },
                'required': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue)) {
                        this._sendErrorToElement('required', errorOn, errorMessage);
                    }
                },
                'email': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue) || !this._isValidEmail(originalValue)) {
                        this._sendErrorToElement('email', errorOn, errorMessage);
                    }
                },
                'min-len-': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue) || this._IsTrue(() => originalValue.length < parseInt(ruleValue))) {
                        this._sendErrorToElement('min-len', errorOn, errorMessage);
                    }
                },
                'max-len-': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue) || this._IsTrue(() => originalValue.length > parseInt(ruleValue))) {
                        this._sendErrorToElement('max-len', errorOn, errorMessage);
                    }
                },
                'num-min-': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue) || this._IsTrue(() => parseInt(originalValue) < parseInt(ruleValue))) {
                        this._sendErrorToElement('num-min', errorOn, errorMessage);
                    }

                },
                'num-max-': function(originalValue, errorOn, errorMessage, ruleValue) {
                    if (this._isEmpty(originalValue) || this._IsTrue(() => parseInt(originalValue) > parseInt(ruleValue))) {
                        this._sendErrorToElement('num-max', errorOn, errorMessage);
                    }

                }
            }
        },
        Object.defineProperties(this._rules.ruleTypes, {
            "_createErrorContainer": {
                enumerable: false,
                configurable: false
            },
            "_isNotaNumber": {
                enumerable: false,
                configurable: false
            },
            "_isEmpty": {
                enumerable: false,
                configurable: false
            },
            "_isValidEmail": {
                enumerable: false,
                configurable: false
            },
            "_IsTrue": {
                enumerable: false,
                configurable: false
            },
            "_sendErrorToElement": {
                enumerable: false,
                configurable: false
            }

        });
    this._isEmpty = function(originalValue) {
        return this._rules.ruleTypes._isEmpty(originalValue);
    }
    this._makeFormattedErrorMessage = function(classname, errorMessage) {
            if (this._isEmpty(errorMessage))
                return '';
            else
            if (classname == 'required' || classname == 'email') {
                return errorMessage;
            } else {
                let ruleName = this._getRule(classname);
                let num = classname.substr(ruleName.length, classname.length - ruleName.length);
                errorMessage = errorMessage.replace('`x`', num);
                return errorMessage;
            }
        },
        this._resetHtml = function(id) {
            document.getElementById(id).innerHTML = "";
        },
        this._getRuleValue = function(inputClAttr, ruleName) {
            return inputClAttr.substr(ruleName.length, inputClAttr.length - ruleName.length);
        },
        this._getAllClassAttributes = function(element) {
            return element.classList;
        },
        this._getInputsForValidate = function(form) {
            return form.getElementsByTagName('input');
        },
        this._getValidationErrorElement = function(element) {
            return element.getAttribute('data-validation-error');
        },
        this.hasRule = function() {

        },
        this.validateForm = function(formId) {
            let formForValidate = document.getElementById(formId);
            if (formForValidate == null) {
                throw new Error('given form doesnt exist');
            } else {
                let inputsForValidate = this._getInputsForValidate(formForValidate);
                for (let input of inputsForValidate) {
                    let errorOccuredOn = this._getValidationErrorElement(input);
                    this._resetHtml(errorOccuredOn);
                    let inputClAttributes = this._getAllClassAttributes(input);
                    for (let inputClAttr of inputClAttributes) {
                        let ruleName = this._getRule(inputClAttr);
                        if (ruleName != null) {
                            let ruleValue = this._getRuleValue(inputClAttr, ruleName);
                            let formalizeErrorMessage = this._makeFormattedErrorMessage(inputClAttr, this._validationConfig.getRuleValueByLang(this._lang, ruleName));
                            this._rules.executeRule(ruleName, input.value, errorOccuredOn, formalizeErrorMessage, ruleValue);
                        }

                    }
                }
            }
        }
}

let validator = new Validator(validationConfig);