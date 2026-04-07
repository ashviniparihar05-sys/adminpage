//import React from 'react';
import React, { useEffect, useState } from 'react';

import { 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Undo2,
  ExternalLink,
  Shield
} from 'lucide-react';

const Financials = () => {
  const transactions = [
    { id: 'TR-55410', event: 'Techno-Garden Summer Festival', amount: '$12,400.00', type: 'Escrow Release', status: 'Pending', date: '2h ago', risk: 'Low' },
    { id: 'TR-55411', event: 'Private Gala Dinner', amount: '$2,100.00', type: 'Payout', status: 'Completed', date: '5h ago', risk: 'None' },
    { id: 'TR-55412', event: 'Future of Web3: London', amount: '$450.00', type: 'Refund Request', status: 'Flagged', date: '1d ago', risk: 'High' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Financial Oversight</h3>
          <p className="text-on-surface-variant text-sm mt-1">Manage escrow, payouts, and fraud prevention.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Total in Escrow</p>
            <p className="text-xl font-extrabold text-primary">$482,910.45</p>
          </div>
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending Payouts</p>
            <p className="text-xl font-extrabold text-secondary">124</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
            <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
              <h4 className="text-sm font-bold text-indigo-900">Recent Transactions</h4>
              <div className="flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Search size={18} /></button>
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Filter size={18} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Risk</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/30">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-on-surface">{tx.event}</div>
                        <div className="text-[11px] text-on-surface-variant">ID: {tx.id} • {tx.date}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">{tx.amount}</td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{tx.type}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tx.risk === 'High' ? 'text-tertiary bg-tertiary-container/10' : tx.risk === 'Low' ? 'text-amber-600 bg-amber-50' : 'text-secondary bg-secondary-container/10'}`}>
                          {tx.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tx.status === 'Completed' ? 'text-on-secondary-container bg-secondary-container' : tx.status === 'Flagged' ? 'text-tertiary bg-tertiary-container/20' : 'text-on-surface-variant bg-surface-container-highest'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Shield size={20} />
              <h4 className="font-bold text-sm uppercase tracking-wider">Fraud Engine Alerts</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-tertiary-container/5 border-l-4 border-tertiary rounded-r-xl">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-tertiary">Suspicious Refund Pattern</p>
                  <AlertCircle size={14} className="text-tertiary" />
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Host "Midnight Rebels" requested 12 refunds in 15 minutes. Potential account takeover or bot activity.</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-bold bg-tertiary text-white px-3 py-1 rounded-lg">Freeze Payouts</button>
                  <button className="text-[10px] font-bold text-on-surface-variant px-3 py-1 hover:bg-surface-container-low rounded-lg">Investigate</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/40 rounded-3xl p-6 border border-indigo-100/30">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Escrow Summary</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Scheduled for Release</span>
                <span className="font-bold">$142,000.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">On Hold (Disputes)</span>
                <span className="font-bold text-tertiary">$12,450.00</span>
              </div>
              <div className="pt-4 border-t border-indigo-100/50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase">Net Platform Fees</span>
                <span className="text-lg font-black text-primary">$42,105.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
