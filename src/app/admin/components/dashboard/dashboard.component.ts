import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  unitPrice: number;
  totalQty: number;
}

interface LatestOrder {
  id: number;
  customer: string;
  status: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: DashboardStats | null = null;
  topProducts: TopProduct[] = [];
  latestOrders: LatestOrder[] = [];
  loading = {
    stats: true,
    sales: true,
    topProducts: true,
    latestOrders: true,
  };

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  private salesChartInstance: Chart | null = null;

  ngAfterViewInit(): void {
    this.loadSalesAnalytics();
  }

  private subs: Subscription[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTopProducts();
    this.loadLatestOrders();
  }

  private loadStats() {
    const sub = this.api.get('/dashboard/stats').subscribe({
      next: (res: any) => {
        if (res && res.code === 200) {
          this.stats = {
            totalUsers: res.result.totalUsers ?? 0,
            totalProducts: res.result.totalProducts ?? 0,
            totalSales: Number(res.result.totalSales ?? 0),
            totalOrders: res.result.totalOrders ?? 0,
          };
        }
      },
      error: () => {},
    });
  }

  private loadSalesAnalytics() {
    this.loading.sales = true;
    const sub = this.api.get('/dashboard/sales-analytics').subscribe({
      next: (res: any) => {
        if (res?.code === 200 && this.salesChartRef) {
          const labels: string[] = Array.isArray(res.result?.date)
            ? res.result.date
            : [];
          const data: number[] = Array.isArray(res.result?.totalSales)
            ? res.result.totalSales.map((v: any) => Number(v ?? 0))
            : [];

          const ctx = this.salesChartRef.nativeElement.getContext('2d');
          if (!ctx) return;

          if (this.salesChartInstance) {
            this.salesChartInstance.data.labels = labels;
            (this.salesChartInstance.data.datasets[0].data as number[]) = data;
            this.salesChartInstance.update();
          } else {
            this.salesChartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  {
                    label: 'Tổng doanh thu',
                    data,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true } },
                scales: {
                  x: { display: true },
                  y: { display: true, beginAtZero: true },
                },
              },
            });
          }
        }
        this.loading.sales = false;
      },
      error: () => (this.loading.sales = false),
    });
    this.subs.push(sub);
  }

  private loadTopProducts() {
    this.loading.topProducts = true;
    const sub = this.api.get('/dashboard/top-products').subscribe({
      next: (res: any) => {
        if (res && res.code === 200 && Array.isArray(res.result)) {
          // map an toàn
          this.topProducts = res.result.map((p: any) => ({
            productId: p.productId ?? p.id ?? 0,
            productName: p.productName ?? p.name ?? 'Không tên',
            unitPrice: Number(p.unitPrice ?? 0),
            totalQty: Number(p.totalQty ?? 0),
          }));
        } else {
          this.topProducts = [];
        }
        this.loading.topProducts = false;
      },
      error: () => (this.loading.topProducts = false),
    });
    this.subs.push(sub);
  }

  private loadLatestOrders() {
    this.loading.latestOrders = true;
    const sub = this.api.get('/dashboard/latest-orders').subscribe({
      next: (res: any) => {
        if (res && res.code === 200 && Array.isArray(res.result)) {
          this.latestOrders = res.result.map((o: any) => ({
            id: o.id,
            customer: o.customer ?? 'Khách',
            status: o.status ?? '',
            total: Number(o.total ?? 0),
          }));
        } else {
          this.latestOrders = [];
        }
        this.loading.latestOrders = false;
      },
      error: () => (this.loading.latestOrders = false),
    });
    this.subs.push(sub);
  }

  // helper format tiền VN
  formatCurrency(v: number) {
    if (v == null) return '0';
    return v.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
  }

  ngOnDestroy(): void {
    // unsubscribe
    this.subs.forEach((s) => s.unsubscribe());
    if (this.salesChartInstance) {
      this.salesChartInstance.destroy();
      this.salesChartInstance = null;
    }
  }
}
