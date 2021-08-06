class PropertiesTP{
  constructor(rusName, value){
    this.name = rusName;
    this.value = value;
  }
}

class TechProcess {
  constructor(name) { 
    this.name = "ТП на изготовление детали " + name;
    this.props = [
      new PropertiesTP("Наименование предприятия", ""),
      new PropertiesTP("Специализация ТП", ""),
      new PropertiesTP("Обозначение чертежа", ""),
      new PropertiesTP("Модификация ПР", ""),
      new PropertiesTP("Наименование ДСЕ", name),
      new PropertiesTP("Технологический комплект", ""),
      new PropertiesTP("Обозначение ТД", ""),
      new PropertiesTP("Фамилия технолога", ""),
      new PropertiesTP("Фамилия нормоконтролера", ""),
      new PropertiesTP("Фамилия руководителя", ""),
      new PropertiesTP("Тшт ТП", ""),
      new PropertiesTP("Комментарий", "")
    ];
    this.children = [
  ];
    this.typeOf = "TechProcess";
    
    this.changeElementValue = function(id, value){
      this.props[id].value = value;
      this.name = "ТП на изготовление детали " + this.props[2].value + ' ' + this.props[4].value;
    }
    this.addNewOperation = function(){
      this.children.unshift(new OperationFromClassifier("default name1"))
    }
   }
}

class OperationFromClassifier{
  constructor(name = ""){
    this.name = name;
    this.props = [
      new PropertiesTP("Код операции", ""),
      new PropertiesTP("N цеха", ""),
      new PropertiesTP("N участка", ""),
      new PropertiesTP("N рабочего места", ""),
      new PropertiesTP("N операции", ""),
      new PropertiesTP("Наименование операции", this.name),
      new PropertiesTP("Обозначения ТД - ссылки", ""),
      new PropertiesTP("Наим. оборудования", ""),    
      new PropertiesTP("Группа оборудования", ""),
      new PropertiesTP("Степень механизации", ""),
      new PropertiesTP("Профессия", ""),
      new PropertiesTP("Разряд", ""),
      new PropertiesTP("УТ", ""),
      new PropertiesTP("Количество работающих", ""),
      new PropertiesTP("Кол-во одновр. изготы-ых дет.", "")
    ];
    this.children = [];
    this.typeOf =  "OperationFromClassifier";
    
    this.changeElementValue = function(id, value){
      this.props[id].value = value;
      this.name = this.props[1].value + " " + this.props[2].value + " " + this.props[4].value + " " + this.props[0].value + " " + this.props[5].value;
      
    };
    this.addNewOperation = function(main_tree, id){
      let removed = main_tree.children.splice(+id + 1);
          
      main_tree.children.push(new OperationFromClassifier("default name0"));
          
      main_tree.children = main_tree.children.concat(removed);
    };

    this.addNewTransition = function(){
      this.children.unshift(new TransitionFromClassifier("defaultName for transition1", this));
    };
    this.addNewSTO = function(){
		this.children.unshift(new STOFromClassifier("defaultName for STO1", this));
    }
    
  }
  
}

class TransitionFromClassifier{
  constructor(name, father){
    this.name = name;
    this.father = father;
    this.props = [
      new PropertiesTP("Номер перехода", ""),
      new PropertiesTP("Текст перехода", this.name),
      new PropertiesTP("Позиция инструмента", ""),
      new PropertiesTP("D или B", ""),
      new PropertiesTP("L длина раб. хода", ""),
      new PropertiesTP("t глубина рез-я[мм]", ""),
      new PropertiesTP("i кол-во проходов", ""),
      new PropertiesTP("S поддача", ""),
      new PropertiesTP("Размерность поддачи", ""),
      new PropertiesTP("N частота вращения", ""),
      new PropertiesTP("V сорость резания", ""),
      new PropertiesTP("То основное время", ""),
      new PropertiesTP("Тв вспомогательное время", ""),
      new PropertiesTP("Паврило", ""),
      new PropertiesTP("Парам для форм-ия операц эскиза", ""),
      new PropertiesTP("Объем партии контроля", "")
    ];
    this.children = [];
    this.typeOf = "TransitionFromClassifier"
    
    this.changeElementValue = function(id, value){
      this.props[id].value = value;
      this.name = this.props[0].value + " " + this.props[1].value;
    };
    this.addNewTransition = function(id){
      let removed = father.children.splice(+id + 1);
      father.children.push(new TransitionFromClassifier("defaultName for transition0", father));
      father.children = father.children.concat(removed);
    };
    this.addNewSTO = function(){
      this.children.unshift(new STOFromClassifier("defaultName for STO1", this));
    }
  }
}
class STOFromClassifier{
  constructor(name, father){
    this.name = name;
    this.father = father;
    this.props = [
      new PropertiesTP("Вид СП", ""),
      new PropertiesTP("Тип СП", ""),
      new PropertiesTP("Обозначение объекта СП", ""),
      new PropertiesTP("Полное обознчение СП", this.name),
      new PropertiesTP("Наименование ТО для ВО", ""),
      new PropertiesTP("Правило", "")
    ];
    this.typeOf = "STOFromClassifier"
    
    this.changeElementValue = function(id, value){
      this.props[id].value = value;
      this.name = this.props[3].value;
    };
    this.addNewSTO = function(id){
      let removed = father.children.splice(+id + 1);
      father.children.push(new STOFromClassifier("defaultName for STO0", father));
      father.children = father.children.concat(removed);
    }
  }
}


Vue.component("tree-item", {
  template: "#item-template",
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length;
    }
  },
  methods: {
    toggle: function() {
      this.isOpen = !this.isOpen;
    
  },
    newCurrentElem: function(event) {
      app.curr_el.id = "";
      app.curr_el = this.item;
      app.curr_el.id = event.target.parentElement.id;
    },
    makeFolder: function() {
      if (!this.isFolder) {
        this.$emit("make-folder", this.item);
        this.isOpen = true;
      }
    }
  }
});

var app = new Vue({
    el: '#main_block',
    data: {
        curr_el: {},
        temp: 0,
        main_tree: new TechProcess("Крышка")
    },
    methods: {
      toggle: function() {
        if (this.isFolder) {
          this.isOpen = !this.isOpen;
        }
      },
      changeValue: function(event){
        this.curr_el.changeElementValue(event.target.id, event.target.value);
      },
      addNewOperation: function() {
        this.curr_el.addNewOperation(this.main_tree, this.curr_el.id);
      },
      addNewTransition: function() {
        this.curr_el.addNewTransition(this.curr_el.id);
      },
      addNewSTO: function() {
        this.curr_el.addNewSTO(this.curr_el.id);
      }
    }
  })