function HintDirective(ConfigService) {
  return function(scope, element, attrs) {
    const hintInput = attrs.to || "hintInput";
    element.bind("focusout", async function(key) {
      scope[attrs.to] = "";
    });
    element.bind("keyup", async function(key) {
      let value = element[0].value;
      const model = attrs.ngModel.split(".");
      if (key.keyCode === 13) {
        value = value.split("/");
        value.pop();
        value = value.join("/") + "/";
        if (!value) value = "/";
        const string = value + scope[attrs.to][0] + "/";
        scope[model[0]][model[1]] = string;
        scope[attrs.to] = await scope.readdirServer(string);
      }
      ConfigService.save({
        inputs: {
          model: model[0],
          value: JSON.stringify(scope[model[0]])
        }
      });
    });

    scope.$watch(attrs.ngModel, async function(value) {
      if (!value) return;
      if (value.charAt(value.length - 1) === "/") {
        scope[attrs.to] = await scope.readdirServer(element[0].value);
      } else {
        const inputfile = value.split("/").pop();
        let newHintInput = scope[attrs.to].filter(hint => {
          return hint.includes(inputfile);
        });
        scope[attrs.to] = newHintInput;
      }
    });
  };
}

module.exports = HintDirective;
