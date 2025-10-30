import { TabBarPlaceholder, TabKey } from './TabBarPlaceholder';
import { HostTabBar, HostTabKey } from './HostTabBar';

type Props = {
    userRole?: 'host' | 'attendee';
    activeTab?: TabKey | HostTabKey;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
};

export const SmartTabBar = ({ userRole = 'attendee', activeTab, onTabSelect }: Props) => {
    if (userRole === 'host') {
        return (
            <HostTabBar
                activeTab={(activeTab as HostTabKey) || 'Dashboard'}
                onTabSelect={onTabSelect as (tab: HostTabKey) => void}
            />
        );
    }

    return (
        <TabBarPlaceholder
            activeTab={(activeTab as TabKey) || 'Home'}
            onTabSelect={onTabSelect as (tab: TabKey) => void}
        />
    );
};
