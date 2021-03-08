import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Lifecycle} from '../../../models/lifecycle.model';
import {LifecycleService} from '../../../services/lifecycle.service';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-lifecycles',
  templateUrl: './lifecycles.component.html',
  styleUrls: ['./lifecycles.component.css', '../../business/business.component.css']
})
export class LifecyclesComponent implements OnInit {
    company = new Company(null);
    hasError = false;
    lifecycle = new Lifecycle(null, false, false, false, false, null, null, null);
    lifecycleLength = 0;
    lifecycles: Lifecycle[] = [];
    lifecyclesRetrieved = false;
    newLifecycle = new Lifecycle(null, false, false, false, false, null, null, null);

    addLifecycle = false;
    selectedIndex = null;


    constructor(
        private companyService: CompanyService,
        private lifecycleService: LifecycleService,
        private logService: LogService,
    ) {}

    ngOnInit() {
        this.getCompanyLifecycles();
    }

    changeAdd() {
        this.addLifecycle = true;
    }

    changeEditView(index: number) {
        this.selectedIndex = index;
        this.getLifecycleById(Number(this.lifecycles[index].id));
    }

    deleteLifecycles() {
        if (confirm('Are you sure you want to remove this lifecycle?')) {
            this.lifecycleService.delete(this.lifecycle)
                .subscribe(data => {
                    this.getCompanyLifecycles();
                    this.resetLifecycles();
                    this.logService.success('Lifecycle removed successfully!');
                }, error => {
                    this.logService.console(error, true);
                });
        }
    }

    deleteLifecycle(lifecycle: Lifecycle, index: any) {
        if (confirm('Are you sure you want to remove this lifecycle?')) {
            this.lifecycleService.delete(lifecycle)
                .subscribe(data => {
                    this.lifecycles.splice(+index, 1);
                    this.resetLifecycles();
                    this.logService.success('Lifecycle removed successfully!');
                }, error => {
                    this.logService.console(error, true);
                });
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.lifecycles, event.previousIndex, event.currentIndex);
        this.updateLifecycles();
      }

    postLifecycle() {
            this.newLifecycle.companyLifecycleId = this.company.id;
            this.newLifecycle.sequenceNumber = this.lifecycles.length;
            this.lifecycleService.post(this.newLifecycle)
            .subscribe(createdLifecycle => {
                this.lifecycles.push(createdLifecycle['obj']);
                this.logService.success('Lifecycle created successfully!');
                this.resetLifecycles();
                this.newLifecycle = new Lifecycle(null, false, false, false, false, null, null, null);
            }, error => {

                this.logService.console(error, true);
            });
    }

    getCompanyLifecycles() {
            this.companyService.get()
            .subscribe(company => {
                this.lifecycles = [];
                this.company = company['obj'];
                this.lifecycles = this.company.lifecycles;
                this.sortBySequenceNumber(this.lifecycles);
                this.getLifecycleLength(this.lifecycles);
                this.lifecyclesRetrieved = true;
            }, error => {

            });

    }

    getLifecycleById(lifecycleId: number) {
        const params = {
            id: lifecycleId
        };
        this.lifecycleService.get(params)
            .subscribe(lifecycle => {
                this.lifecycle = lifecycle['obj'];
            }, error => {

                this.logService.console(error, true);
            });
    }

    getLifecycleLength(lifecycles: Lifecycle[]) {
        this.lifecycleLength = 0;
        lifecycles.forEach(i => {
            this.lifecycleLength ++;
        });
    }

    resetLifecycles() {
        this.newLifecycle = new Lifecycle(null);
        this.addLifecycle = false;
        this.selectedIndex = null;
    }

    updateLifecycle(lifecycle: Lifecycle) {
        this.lifecycleService.patch(lifecycle)
        .subscribe(data => {
            this.logService.success('Lifecycle Updated')
            this.resetLifecycles();
        }, error => {
            this.logService.console(error, true);
        });
    }

    updateLifecycles() {
        let hasError = false;
        this.lifecycles.forEach((life, i) => {
            life.sequenceNumber = i;
            this.lifecycleService.patch(life)
            .subscribe(createdLifecycle => {

            }, error => {
                if (!hasError) {
                    this.logService.console(error, true);
                }
                hasError = true;
            });
        });
    }

    sortBySequenceNumber(lifecycles: Lifecycle[]) {
        lifecycles.sort((a, b) => {
            const seqNumber1 = +new Date(a.sequenceNumber);
            const seqNumber2 = +new Date(b.sequenceNumber);
            return seqNumber1 - seqNumber2;
        });
    }

    styleTabs(style: boolean) {
        if (style === true) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }

    styleGroups() {
        return {'margin-bottom': '37px'};
    }

}
