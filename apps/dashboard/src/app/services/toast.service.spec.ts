import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { SharedModule } from '../shared/shared.module';

describe.skip('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
