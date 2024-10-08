<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [Schema][1]
    *   [Parameters][2]
*   [isInSchema][3]
    *   [Parameters][4]
*   [isRequired][5]
    *   [Parameters][6]
*   [checkIsRequired][7]
    *   [Parameters][8]
*   [checkType][9]
    *   [Parameters][10]
*   [isValidKey][11]
    *   [Parameters][12]
*   [validateData][13]
    *   [Parameters][14]
*   [validateCondition][15]
    *   [Parameters][16]
*   [addDefault][17]
    *   [Parameters][18]

## Schema

schema class

### Parameters

*   `description` **DescriptorType**&#x20;

## isInSchema

check if a key is defined in the schemas

### Parameters

*   `key` **[string][19]** :the key to check
*   `description` **any** :the schemas description

Returns **[boolean][20]** :result of the test

## isRequired

check if key is required

### Parameters

*   `description` **any** :the schema description
*   `key` **[string][19]** {string} : the key description

Returns **[boolean][20]**&#x20;

## checkIsRequired

check if a key in data  is required from the schemas description

### Parameters

*   `data` **any** :the dictionnary containing the key
*   `description` **any** :the schemas description

Returns **[boolean][20]** :result of the test

## checkType

check if a key in data  has the same type defined required from the schemas description

### Parameters

*   `data` **any**&#x20;
*   `key` **[string][19]** :the key to check
*   `description` **any** :the schemas description

Returns **[boolean][20]** :result of the test

## isValidKey

check if a key from data is valid regarding  schema description

### Parameters

*   `data` **any** {any}: the data to add
*   `description` **DescriptorType** {any}: the schema description
*   `key` **[string][19]** {string}:the key to check

Returns **[boolean][20]** :

## validateData

check if data is valid given the schemas

### Parameters

*   `data` **any** :the data to check
*   `schema` **[Schema][1]**&#x20;

Returns **[boolean][20]** : the result of the test

## validateCondition

check if condition is valid given the schemas(eg: all keys are in the schemas and have same type)

### Parameters

*   `condition` **any** :the data to check
*   `schema` **[Schema][1]**&#x20;

Returns **[boolean][20]** : the result of the test

## addDefault

add default values to data if missing

### Parameters

*   `data` **any**&#x20;
*   `descriptor` **DescriptorType**&#x20;

Returns **any**&#x20;

[1]: #schema

[2]: #parameters

[3]: #isinschema

[4]: #parameters-1

[5]: #isrequired

[6]: #parameters-2

[7]: #checkisrequired

[8]: #parameters-3

[9]: #checktype

[10]: #parameters-4

[11]: #isvalidkey

[12]: #parameters-5

[13]: #validatedata

[14]: #parameters-6

[15]: #validatecondition

[16]: #parameters-7

[17]: #adddefault

[18]: #parameters-8

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
