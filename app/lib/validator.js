/**
 * 整个项目所需的校验器
 */
const { LinValidator, Rule } = require('../../core/validator-v2')

class PositiveIntegarValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '必须是整数', { min: 1 })
    ]
  }
}

module.exports = {
  PositiveIntegarValidator
}
