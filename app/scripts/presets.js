(function(window, $, undefined) {

  var PRESET_FILE_PATH = './presets.json';

  var _data;

  // public

  function Presets() {

    $.ajax({
      method: 'GET',
      url: PRESET_FILE_PATH,
      dataType: 'json',
      success: function(rData) {
        _data = rData;
      }
    });

  }

  Presets.prototype.getPreset = function(ePresetId) {

    if (! _data || ! _data[ePresetId]) {
      return false;
    }

    return $.extend(true, {}, _data[ePresetId]);

  };

  Presets.prototype.printCurrentSetting = function(eData) {
    console.log(eData);
  };

  window.Presets = window.Presets || Presets;

})(window, window.jQuery);
