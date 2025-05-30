// shared/lib/module-manager.ts
import { ModuleConfig } from '@/shared/types/module';

export class ModuleManager {
  private modules: Map<string, ModuleConfig> = new Map();

  registerModule(config: ModuleConfig) {
    this.modules.set(config.name, config);
  }

  getModule(name: string): ModuleConfig | undefined {
    return this.modules.get(name);
  }

  getAllModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  getModulesByCategory(category: string): ModuleConfig[] {
    return this.getAllModules().filter(module => module.category === category);
  }

  validateDependencies(moduleName: string): boolean {
    const module = this.getModule(moduleName);
    if (!module) return false;

    // Check if all required dependencies are available
    return module.dependencies.required.every(dep => 
      this.modules.has(dep) || this.isExternalDependency(dep)
    );
  }

  private isExternalDependency(dep: string): boolean {
    // Check if it's an npm package or system dependency
    return dep.startsWith('npm:') || dep.startsWith('system:');
  }

  resolveModuleDependencies(moduleNames: string[]): string[] {
    const resolved: string[] = [];
    const visited = new Set<string>();

    const resolve = (moduleName: string) => {
      if (visited.has(moduleName)) return;
      visited.add(moduleName);

      const module = this.getModule(moduleName);
      if (!module) return;

      // Resolve dependencies first
      module.dependencies.required.forEach(dep => {
        if (this.modules.has(dep)) {
          resolve(dep);
        }
      });

      resolved.push(moduleName);
    };

    moduleNames.forEach(resolve);
    return resolved;
  }
}

export const moduleManager = new ModuleManager();
