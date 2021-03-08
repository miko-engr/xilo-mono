import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xilo-mono-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {
  @Input() query;
  @Input() config;
  @Output() changeQuery = new EventEmitter();

  allowRuleset = true;

  constructor() {}

  ngOnInit(): void {}

  onQueryChange($event) {
    const query = $event;
    const expression = this.generateCondition(query);
    this.setParents(query);
    this.changeQuery.emit({
      query,
      expression,
    });
  }

  onChangeOperator($event, rule) {
    rule.operator = $event.target.value;
    this.onQueryChange(this.query);
  }

  generateCondition(query) {
    if (query.condition) {
      const rules = query.rules;
      if (rules.length === 0) {
        return 'false';
      }

      if (rules.length === 1) {
        return this.getExpression(rules[0]);
      }

      const condition = query.condition === 'and' ? '&&' : '||';
      return `(${rules
        .map((rule) => this.generateCondition(rule))
        .join(` ${condition} `)})`;
    } else {
      return this.getExpression(query);
    }
  }

  getExpression(rule: any): string {
    const value =
      typeof rule.value === 'string' &&
      rule.value !== 'true' &&
      rule.value !== 'false'
        ? `'${rule.value}'`
        : rule.value;
    switch (rule.operator) {
      case '=':
        return `model['${rule.field}'] == ${value}`;
      case 'contains':
        return `(model['${rule.field}'] && model['${rule.field}'].indexOf(${value}) > -1)`;
      case '!=':
        return `model['${rule.field}'] != ${value}`;
      case 'in':
        return `${JSON.stringify(value)}.includes(model['${rule.field}'])`;
      case 'not in':
        return `${JSON.stringify(value)}.includes(model['${rule.field}'])`;
      case 'is null':
        return `model['${rule.field}'] == null`;
      case 'is not null':
        return `model['${rule.field}'] != null`;
      case '<':
        return `model['${rule.field}'] < ${value}`;
      case '<=':
        return `model['${rule.field}'] <= ${value}`;
      case '>':
        return `model['${rule.field}'] > ${value}`;
      case '>=':
        return `model['${rule.field}'] >= ${value}`;
      default:
        return `model['${rule.field}'] ${rule.operator} ${value}`;
    }
  }

  setParents(query) {
    if (query?.rules?.length > 0) {
      query.rules.forEach((rule) => {
        const data = this.config.fields[rule.field];
        rule.parents = data.parents;
      });
    }
  }
}
