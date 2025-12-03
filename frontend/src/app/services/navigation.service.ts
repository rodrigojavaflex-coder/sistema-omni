import { Injectable, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

export type MenuState = 'open' | 'hidden';
export type ViewportMode = 'desktop' | 'mobile';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private menuStateSubject = new BehaviorSubject<MenuState>('hidden');
  private viewportSubject = new BehaviorSubject<ViewportMode>('desktop');

  public menuState$ = this.menuStateSubject.asObservable();
  public viewport$ = this.viewportSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.observeViewport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isMenuOpen(): boolean {
    return this.menuStateSubject.value === 'open';
  }

  toggleMenu(): void {
    const nextState = this.menuStateSubject.value === 'open' ? 'hidden' : 'open';
    this.menuStateSubject.next(nextState);
  }

  closeMenu(): void {
    this.menuStateSubject.next('hidden');
  }

  closeOnNavigation(): void {
    this.closeMenu();
  }

  private observeViewport(): void {
    this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(
        map(result => (result.matches ? 'desktop' : 'mobile') as ViewportMode),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(viewport => {
        this.viewportSubject.next(viewport);
        if (viewport === 'mobile') {
          this.menuStateSubject.next('hidden');
        }
      });
  }
}
