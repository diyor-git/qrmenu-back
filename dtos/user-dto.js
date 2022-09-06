module.exports = class UserDto {
  email;
  id;
  role;
  cafe_id;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.role = model.role;
    this.cafe_id = model.cafe_id;
  }
};
