/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Minus, Radius, StopCircle, TriangleAlert } from 'lucide-react';

import { Badge } from '@codevs/ui/badge';
import { Button } from '@codevs/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@codevs/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@codevs/ui/table';

//Mock Data if not exists
import { strategy_data } from './strategy_data';

const underlying_data = new Set(strategy_data.map((row) => row.underlying));

export function TradingStrategiesTable({ data }: { data?: any[] }) {
  const currentUnderlying = Array.from(underlying_data);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="border-white bg-gray-600 font-semibold text-white">
              Underlying
            </SelectTrigger>
            <SelectContent>
              {currentUnderlying.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="border-white bg-gray-600 font-semibold text-white">
            Active Only
          </Button>
        </div>
        <Button className="border-white bg-gray-600 font-semibold text-white">
          <Filter className="mr-2 h-3 w-3" />
          More Filters
        </Button>
      </div>
      <StrategyTable data={data} />
    </div>
  );
}

function StrategyTable({ data = strategy_data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Underlying</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Strategy Name</TableHead>
          <TableHead>Win Rate</TableHead>
          <TableHead>Avg Trade Length</TableHead>
          <TableHead>Return TTM</TableHead>
          <TableHead>Trades TTM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              <StrategyStatusBadge status={row.status} />
            </TableCell>
            <TableCell>
              <UnderlyingBadge underlying_badge={row.underlying} />
            </TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.strategyName}</TableCell>
            <TableCell>{row.winRate}</TableCell>
            <TableCell>{row.avgTradeLength}</TableCell>
            <TableCell>{row.returnTTM}</TableCell>
            <TableCell>{row.tradesTTM}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StrategyStatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case 'starting':
      return (
        <Badge className="rounded-full border border-yellow-300 bg-transparent text-yellow-300">
          <TriangleAlert className="mr-2 h-4 w-4 text-yellow-300" />
          STARTING
        </Badge>
      );

    case 'inactive':
      return (
        <Badge className="rounded-full border-white bg-transparent text-white">
          <Minus className="mr-2 h-4 w-4 text-white" />
          INACTIVE
        </Badge>
      );

    case 'ending':
      return (
        <Badge className="rounded-full border-red-300 bg-transparent text-red-300">
          <StopCircle className="mr-2 h-4 w-4 text-red-300" />
          ENDING
        </Badge>
      );

    case 'day 2':
      return (
        <Badge className="rounded-full border-lime-300 bg-transparent text-lime-300">
          <Radius className="mr-2 h-4 w-4 text-lime-300" />
          Day
        </Badge>
      );
  }
}

function UnderlyingBadge({ underlying_badge }: { underlying_badge: string }) {
  const color =
    underlying_badge === 'TSLA'
      ? 'bg-red-200 text-red-800'
      : 'bg-blue-200 text-blue-800';
  return <Badge className={color}>{underlying_badge}</Badge>;
}
